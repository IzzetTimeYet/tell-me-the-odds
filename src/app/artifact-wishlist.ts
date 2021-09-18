import { Artifact } from "./artifact";

export interface Wishlist {
  items: Wishlist.Item[];
  filter: Wishlist.Filter;
  /** @todo functions */
}

export namespace Wishlist {
  export interface Item {
    readonly set: Artifact.Set;
    readonly type: Artifact.Type;
    readonly mainstat: Artifact.Stat;
    requiredSubstats: Artifact.Stat[];
    wishlisted: boolean;
  }

  export interface Filter {
    sets: Artifact.Set[];
    types: Artifact.Type[];
    sandsMainstats: Artifact.Stat[];
    gobletMainstats: Artifact.Stat[];
    circletMainstats: Artifact.Stat[];
  }

  export interface ResinAnalysis {
    source: Artifact.ResinSource;
    chance: number;
    cost: number;
    efficiency: number;
  }

  export function analyzeResinEfficiency(wishlist: Wishlist): ResinAnalysis[] {
    const setWishlists: Map<Artifact.Set, Wishlist.Item[]> = new Map<Artifact.Set, Wishlist.Item[]>();
    wishlist.items.forEach(item => {
      if (!setWishlists.has(item.set)) {
        setWishlists.set(item.set, []);
      }
      setWishlists.get(item.set)!.push(item);
    });
    let analyses: ResinAnalysis[] = [];
    Artifact.ResinSourcesArray.forEach(source => {
      const sourceSets = Artifact.getSourceSets(source);
      let chance: number = 0;
      sourceSets.forEach(set => {
        if (setWishlists.has(set)) {
          setWishlists.get(set)!.forEach(item => {
            if (item.wishlisted) chance += computeChanceOfStatRolls(item);
          });
        }
      });
      chance /= 5; // divide by 5, to account for 20% chance for artifact to be of a specific type.
      chance /= sourceSets.length; // divide by number of sets this source drops (currently always 2);
      chance *= Artifact.getDropRate(source);
      const cost: number = Artifact.getResinCost(source);
      analyses.push({
        source: source,
        chance: chance,
        cost: cost,
        efficiency: chance / cost
      });
    });
    return analyses.sort((a, b) => b.efficiency - a.efficiency);
  }

  function computeChanceOfStatRolls(item: Item): number {
    const mainstatChance = Artifact.getMainstatChance(item.type, item.mainstat);
    const substatWeightSum = Artifact.SubstatWeightTotal - Artifact.getSubstatWeight(item.mainstat);
    const averageWeightOfSubstatsLeft = computeAverageWeightOfSubstatsLeft(item);
    let permutationOddsSum = 0;
    for (let a = 0; a < 4; ++a) {
      for (let b = 0; b < 4; ++b) {
        if (b == a) continue;
        for (let c = 0; c < 4; ++c) {
          if (c == a || c == b) continue;
          for (let d = 0; d < 4; ++d) {
            if (d == a || d == b || d == c) continue;
            permutationOddsSum += computePermutationChance(item, [a, b, c, d], substatWeightSum, averageWeightOfSubstatsLeft);
          }
        }
      }
    }
    return mainstatChance * (permutationOddsSum / 24);
  }

  function computeAverageWeightOfSubstatsLeft(item: Item): number {
    let nSubstatsLeft = 0;
    let substatsLeftWeightSum = 0;
    Artifact.SubstatsArray.forEach(substat => {
      if (substat != item.mainstat && !item.requiredSubstats.includes(substat)) {
        ++nSubstatsLeft;
        substatsLeftWeightSum += Artifact.getSubstatWeight(substat);
      }
    });
    return substatsLeftWeightSum / nSubstatsLeft;
  }

  function computePermutationChance(item: Wishlist.Item, permutation: number[], substatWeightSum: number, averageWeightOfSubstatsLeft: number): number {
    let chance = 1;
    permutation.forEach((index) => {
      if (item.requiredSubstats.length > index && Artifact.canHaveSubstat(item.requiredSubstats[index])) {
        const weight = Artifact.getSubstatWeight(item.requiredSubstats[index])!;
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