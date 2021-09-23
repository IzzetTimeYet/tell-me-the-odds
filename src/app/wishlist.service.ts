import { Injectable } from '@angular/core';
import { Genshin } from './genshin';
import { Wishlist } from './artifact-wishlist';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private static readonly JSON_WISHLIST_KEY: string = "wishlist";
  wishlist!: Wishlist;

  constructor(private messageService: MessageService) {
    this.initializeWishlist();
  }

  private initializeWishlist(): void {
    // localStorage.clear();
    const jsonValue = localStorage.getItem(WishlistService.JSON_WISHLIST_KEY);
    if (jsonValue) {
      this.wishlist = <Wishlist> JSON.parse(jsonValue);
      this.messageService.add(`WishlistService: Loaded wishlist from local storage.`);
      return;
    }
    this.messageService.add(`WishlistService: Wishlist was not found in local storage; creating new wishlist...`);
    // const items: Wishlist.Item[] = [];
    // Genshin.ArtifactSets.forEach(set => {
    //   Genshin.ArtifactTypes.forEach(type => {
    //     Genshin.getMainstats(type).forEach(mainstat => {
    //       const item: Wishlist.Item = {set: set, type: type, mainstat: mainstat, requiredSubstats: [], wishlisted: false};
    //       items.push(item);
    //     });
    //   });
    // });
    this.wishlist = { items: []/*, filter: {sets: [], types: [], sandsMainstats: [], gobletMainstats: [], circletMainstats: []}*/ };
    this.updateWishlist(`New wishlist created and stored in local storage.`);
  }

  add(artifact: Wishlist.Item): void {
    this.wishlist.items.unshift(artifact);
    this.updateWishlist(`Updated wishlist, added a new artifact.`); /** @todo new artifact details */
  }

  remove(artifact: Wishlist.Item): boolean {
    const index = this.wishlist.items.indexOf(artifact);
    if (index == -1) return false;
    this.wishlist.items.splice(index, 1);
    this.updateWishlist(`Updated wishlist, removed an artifact.`); /** @todo new artifact details */
    return true;
  }

  private updateWishlist(updateMessage: string): void {
    localStorage.setItem(WishlistService.JSON_WISHLIST_KEY, JSON.stringify(this.wishlist));
    this.messageService.add(`WishlistService: ${updateMessage}`);
  }

  /** @todo remove this method, for safety reasons? */
  getWishlistItems(): Wishlist.Item[] {
    return this.wishlist.items;
  }

  // getWishlistFilter(): Wishlist.Filter {
  //   return this.wishlist.filter;
  // }

  analyze(): Wishlist.ResinAnalysis[] {
    this.messageService.add(`WishlistService: Analyzing wishlist for resin efficiency...`);

    // Create set of wishlisted mainstats. This reduces the number of substat combinations to iterate through.
    const wishlistedMainstats: Set<Genshin.Stat> = new Set<Genshin.Stat>();
    this.wishlist.items.forEach(item => {
      /*if (item.wishlisted)*/ wishlistedMainstats.add(item.mainstat);
    });

    // Create map of set wishlist chance sums, as an intermediate storage.
    const setWishlistChanceSums: Map<Genshin.ArtifactSet, number> = new Map<Genshin.ArtifactSet, number>();
    // For each combination, check if the combination covers any wishlisted artifacts' required substats.
    // If so, compute the stat rolls chance, and add it to all matching wishlisted artifacts' set chance sums.

    wishlistedMainstats.forEach(mainstat => {
      const combinations: ReadonlyArray<ReadonlyArray<Genshin.Stat>> = Genshin.getSubstatCombinationsAfterMainstat(mainstat);
      combinations.forEach(combination => {
        const matches: Wishlist.Item[] = [];
        this.wishlist.items.forEach(item => {
          const alreadyMatched: boolean = matches.some(match => {
            return match.set === item.set && match.type === item.type && match.mainstat === item.mainstat
              && match.requiredSubstats[0] === combination[0]
              && match.requiredSubstats[1] === combination[1]
              && match.requiredSubstats[2] === combination[2]
              && match.requiredSubstats[3] === combination[3];
          });
          if (/*item.wishlisted &&*/ item.mainstat == mainstat && this.matchesSubstats(item, combination) && !alreadyMatched) {
            matches.push({
              set: item.set,
              type: item.type,
              mainstat: mainstat,
              requiredSubstats: Array.from(combination)/*,
              wishlisted: true*/
            });
          }
        });
        if (matches.length > 0) {
          const chanceOfSubstats: number = this.computeChanceOfSubstats(mainstat, combination);
          matches.forEach(match => {
            const chanceOfStatRolls: number = Genshin.getMainstatChance(match.type, match.mainstat) * chanceOfSubstats;
            let chanceSum = setWishlistChanceSums.has(match.set) ? setWishlistChanceSums.get(match.set)! : 0;
            chanceSum += chanceOfStatRolls;
            setWishlistChanceSums.set(match.set, chanceSum);
          });
        }
      });
    });

    const analyses: Wishlist.ResinAnalysis[] = [];
    Genshin.ResinArtifactSources.forEach(source => {
      const sourceSets = Genshin.getResinArtifactSourceSets(source);
      let sourceChance: number = 0;
      sourceSets.forEach(set => {
        if (setWishlistChanceSums.has(set)) sourceChance += setWishlistChanceSums.get(set)!;
      });
      sourceChance /= 5; // divide by 5, to account for 20% chance for artifact to be of a specific type.
      sourceChance /= sourceSets.length; // divide by number of sets this source drops (currently always 2);
      sourceChance *= Genshin.getDropRate(source);
      const cost: number = Genshin.getResinCost(source);
      analyses.push({
        source: source,
        chance: sourceChance,
        cost: cost,
        efficiency: sourceChance / cost
      });
    });
    analyses.sort((a, b) => b.efficiency - a.efficiency);
    this.messageService.add(`WishlistService: Resin efficiency analysis complete.`);
    return analyses;
  }

  private matchesSubstats(item: Wishlist.Item, combination: readonly Genshin.Stat[]) {
    return item.requiredSubstats.every(requiredSubstat => combination.includes(requiredSubstat));
  }

  private computeChanceOfSubstats(mainstat: Genshin.Stat, requiredSubstats: readonly Genshin.Stat[]): number {
    // const mainstatChance = Genshin.getMainstatChance(type, mainstat);
    const substatWeightSum = Genshin.SubstatWeightTotal - Genshin.getSubstatWeight(mainstat);
    const averageWeightOfSubstatsLeft = this.computeAverageWeightOfSubstatsLeft(mainstat, requiredSubstats);
    let permutationOddsSum = 0;
    for (let a = 0; a < 4; ++a) {
      for (let b = 0; b < 4; ++b) {
        if (b == a) continue;
        for (let c = 0; c < 4; ++c) {
          if (c == a || c == b) continue;
          for (let d = 0; d < 4; ++d) {
            if (d == a || d == b || d == c) continue;
            permutationOddsSum += this.computePermutationChance(requiredSubstats, [a, b, c, d], substatWeightSum, averageWeightOfSubstatsLeft);
          }
        }
      }
    }
    return permutationOddsSum; // no divide by 24?
  }

  private computeAverageWeightOfSubstatsLeft(mainstat: Genshin.Stat, requiredSubstats: readonly Genshin.Stat[]): number {
    let nSubstatsLeft = 0;
    let substatsLeftWeightSum = 0;
    Genshin.Substats.forEach(substat => {
      if (substat != mainstat && !requiredSubstats.includes(substat)) {
        ++nSubstatsLeft;
        substatsLeftWeightSum += Genshin.getSubstatWeight(substat);
      }
    });
    return substatsLeftWeightSum / nSubstatsLeft;
  }

  private computePermutationChance(requiredSubstats: readonly Genshin.Stat[], permutation: number[], substatWeightSum: number, averageWeightOfSubstatsLeft: number): number {
    if (requiredSubstats.length < 4)
      throw new Error("");
     
    let chance = 1;
    permutation.forEach((index) => {
      if (requiredSubstats.length > index && Genshin.isLegalSubstat(requiredSubstats[index])) {
        const weight = Genshin.getSubstatWeight(requiredSubstats[index])!;
        /** @todo should index #4 also be multiplied by 0.2? since only ~20% of artifacts start with a 4th stat? */
        chance *= weight / substatWeightSum;
        substatWeightSum -= weight;
      } else {
        substatWeightSum -= averageWeightOfSubstatsLeft;
      }
    });
    return chance;
  }
}
