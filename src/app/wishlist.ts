import { formatPercent } from "@angular/common";
import { Artifact } from "./artifact";

export class WishlistArtifact {
  set!: Artifact.Set;
  type!: Artifact.Type;
  mainstat!: Artifact.Stat;
  requiredSubstats!: Artifact.Stat[];
  wishlisted!: boolean;

  constructor(set: Artifact.Set, type: Artifact.Type, mainstat: Artifact.Stat, requiredSubstats: Artifact.Stat[], wishlisted: boolean) {
    this.set = set;
    this.type = type;
    this.mainstat = mainstat;
    this.requiredSubstats = requiredSubstats;
    this.wishlisted = wishlisted;
  }

  statRollsChance(): string {
    return formatPercent(this.computeStatRollsChance(), 'en-US', '1.4-4');
  }

  computeStatRollsChance(): number {
    const mainstatChance = Artifact.getMainstatChance(this.type, this.mainstat);
    const substatWeightSum = Artifact.SubstatWeightTotal - Artifact.getSubstatWeight(this.mainstat);
    const averageWeightOfSubstatsLeft = this.computeAverageWeightOfSubstatsLeft();
    let permutationOddsSum = 0;
    for (let a = 0; a < 4; ++a) {
      for (let b = 0; b < 4; ++b) {
        if (b == a) continue;
        for (let c = 0; c < 4; ++c) {
          if (c == a || c == b) continue;
          for (let d = 0; d < 4; ++d) {
            if (d == a || d == b || d == c) continue;
            permutationOddsSum += this.computePermutationChance([a, b, c, d], substatWeightSum, averageWeightOfSubstatsLeft);
          }
        }
      }
    }
    return mainstatChance * (permutationOddsSum / 24);
  }

  private computeAverageWeightOfSubstatsLeft(): number {
    let nSubstatsLeft = 0;
    let substatsLeftWeightSum = 0;
    Artifact.createSubstatsArray().forEach(substat => {
      if (substat != this.mainstat && !this.requiredSubstats.includes(substat)) {
        ++nSubstatsLeft;
        substatsLeftWeightSum += Artifact.getSubstatWeight(substat);
      }
    });
    // Substats.forEach((weight, substat) => {
    //   if (substat != this.mainstat && !this.requiredSubstats.includes(substat)) {
    //     ++nSubstatsLeft;
    //     substatsLeftWeightSum += weight;
    //   }
    // });
    return substatsLeftWeightSum / nSubstatsLeft;
  }

  private computePermutationChance(permutation: number[], substatWeightSum: number, averageWeightOfSubstatsLeft: number): number {
    let chance = 1;
    permutation.forEach((index) => {
      if (this.requiredSubstats.length > index && Artifact.canHaveSubstat(this.requiredSubstats[index])) {
        const weight = Artifact.getSubstatWeight(this.requiredSubstats[index])!;
        // TODO should index #4 also be multiplied by 0.2? since only ~20% of artifacts start with a 4th stat?
        chance *= weight / substatWeightSum;
        substatWeightSum -= weight;
      } else {
        substatWeightSum -= averageWeightOfSubstatsLeft;
      }
    });
    return chance;
  }
}

function computeSetOdds(wishlist: Map<Artifact.Set, WishlistArtifact[]>): Map<Artifact.Set, number> {
  const setOdds = new Map<Artifact.Set, number>();
  wishlist.forEach((setWishlist, set) => {
    let setChance = 0;
    setWishlist.forEach(wishlistArtifact => {
      if (wishlistArtifact.wishlisted) setChance += wishlistArtifact.computeStatRollsChance();
    });
    setOdds.set(set, setChance / 5); // divide by 5 to account for 20% chance to be an artifact of specific type.
  });
  return setOdds;
}

export namespace Wishlist {
  export interface SourceAnalysis {
    source: Artifact.Source;
    chance: number;
    //resinCost: number;
    //efficiency: number;
  }

  export function analyzeWishlist(wishlist: Map<Artifact.Set, WishlistArtifact[]>): SourceAnalysis[] {
    const setOdds: Map<Artifact.Set, number> = computeSetOdds(wishlist);
    const wishlistAnalyses: SourceAnalysis[] = [];
    Object.values(Artifact.Source).forEach(artifactSource => {
      let sourceChance = 0;
      const sourceSets: Artifact.Set[] = Artifact.getSourceSets(artifactSource);
      sourceSets.forEach(artifactSet => {
        sourceChance += setOdds.has(artifactSet) ? setOdds.get(artifactSet)! : 0;
      });
      sourceChance /= sourceSets.length; // divide by number of sets this source drops (currently always 2)
      sourceChance *= Artifact.getDropRate(artifactSource);
      wishlistAnalyses.push({
        source: artifactSource,
        chance: sourceChance
      });
    });
    return wishlistAnalyses;
  }
}

// // sum odds of rolling each wishlisted artifact of a given set, divided by 5 (20% of being specific artifact type)
// // set odds = Map<ArtifactSet, number>
// // for each artifact source:
// // find product: (set odds * set frequency * five-star frequency), sum for each artifact source
// // mystic offering works differently...save for later?
// // source odds = Map<ArtifactSource, number>
// // relative efficiency => 100% is the highest source odds value.
// divide by resin cost