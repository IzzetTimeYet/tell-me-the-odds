export namespace Genshin {

  export enum ArtifactType {
    Flower = "Flower",
    Plume = "Plume",
    Sands = "Sands",
    Goblet = "Goblet",
    Circlet = "Circlet"
  }
  export const ArtifactTypes: ReadonlyArray<ArtifactType> = Array.from(Object.values(ArtifactType));

  export enum Stat {
    HpFlat = "HP",
    HpPercent = "HP %",
    AtkFlat = "ATK",
    AtkPercent = "ATK %",
    DefFlat = "DEF",
    DefPercent = "DEF %",
    EnergyRecharge = "Energy Recharge",
    ElementalMastery = "Elemental Mastery",
    CritRate = "CRIT Rate",
    CritDamage = "CRIT DMG",
    PyroDamage = "Pyro DMG",
    ElectroDamage = "Electro DMG",
    CryoDamage = "Cryo DMG",
    HydroDamage = "Hydro DMG",
    AnemoDamage = "Anemo DMG",
    GeoDamage = "Geo DMG",
    //DendroDamage = "Dendro DMG",
    PhysicalDamage = "Physical DMG",
    HealingBonus = "Healing Bonus",
  }

  const TypeMainstatWeights: Map<ArtifactType, Map<Stat, number>> = new Map<ArtifactType, Map<Stat, number>>();
  TypeMainstatWeights.set(ArtifactType.Flower, new Map<Stat, number>(
    [
      [Stat.HpFlat, 1]
    ]
  ));
  TypeMainstatWeights.set(ArtifactType.Plume, new Map<Stat, number>(
    [
      [Stat.AtkFlat, 1]
    ]
  ));
  TypeMainstatWeights.set(ArtifactType.Sands, new Map<Stat, number>(
    [
      [Stat.HpPercent, 1334],
      [Stat.AtkPercent, 1333],
      [Stat.DefPercent, 1333],
      [Stat.EnergyRecharge, 500],
      [Stat.ElementalMastery, 500]
    ]
  ));
  TypeMainstatWeights.set(ArtifactType.Goblet, new Map<Stat, number>(
    [
      [Stat.HpPercent, 850],
      [Stat.AtkPercent, 850],
      [Stat.DefPercent, 800],
      [Stat.ElementalMastery, 100],
      [Stat.PyroDamage, 200],
      [Stat.ElectroDamage, 200],
      [Stat.CryoDamage, 200],
      [Stat.HydroDamage, 200],
      [Stat.AnemoDamage, 200],
      [Stat.GeoDamage, 200],
      // [Stat.DendroDamage, 200],
      [Stat.PhysicalDamage, 200]
    ]
  ));
  TypeMainstatWeights.set(ArtifactType.Circlet, new Map<Stat, number>(
    [
      [Stat.HpPercent, 1100],
      [Stat.AtkPercent, 1100],
      [Stat.DefPercent, 1100],
      [Stat.CritRate, 500],
      [Stat.CritDamage, 500],
      [Stat.HealingBonus, 500],
      [Stat.ElementalMastery, 200]
    ]
  ));
  const ReadonlyMainstatsArrays: Map<ArtifactType, ReadonlyArray<Stat>> = new Map<ArtifactType, ReadonlyArray<Stat>>();
  export function getMainstats(type: ArtifactType): ReadonlyArray<Stat> {
    if (!ReadonlyMainstatsArrays.has(type)) {
      const mainstatsArray: ReadonlyArray<Stat> = Array.from(TypeMainstatWeights.get(type)!.keys());
      ReadonlyMainstatsArrays.set(type, mainstatsArray);
    }
    return ReadonlyMainstatsArrays.get(type)!;
  }

  // Lazily-loaded map of odds of rolling each mainstat for each artifact type.
  const TypeMainstatOdds: Map<ArtifactType, Map<Stat, number>> = new Map<ArtifactType, Map<Stat, number>>();
  export function getMainstatChance(type: ArtifactType, mainstat: Stat): number {
    // lazy-load inner map.
    if (!TypeMainstatOdds.has(type)) {
      TypeMainstatOdds.set(type, new Map<Stat, number>());
    }
    const odds = TypeMainstatOdds.get(type)!;
    // lazy-load inner map entries.
    if (!odds.has(mainstat)) {
      if (!TypeMainstatWeights.has(type) || !TypeMainstatWeights.get(type)!.has(mainstat)) {
        // if type or mainstat is illegal, odds are 0.
        odds.set(mainstat, 0);
      } else {
        // otherwise, compute and set the odds.
        const mainstatWeight = TypeMainstatWeights.get(type)!.get(mainstat)!;
        let weightTotal = 0;
        TypeMainstatWeights.get(type)!.forEach(weight => { weightTotal += weight; });
        odds.set(mainstat, mainstatWeight / weightTotal);
      }
    }
    // return odds.
    return odds.get(mainstat)!;
  }

  const SubstatWeights: Map<Stat, number> = new Map<Stat, number>(
    [
      [Stat.HpFlat, 6],
      [Stat.HpPercent, 4],
      [Stat.AtkFlat, 6],
      [Stat.AtkPercent, 4],
      [Stat.DefFlat, 6],
      [Stat.DefPercent, 4],
      [Stat.EnergyRecharge, 4],
      [Stat.ElementalMastery, 4],
      [Stat.CritRate, 3],
      [Stat.CritDamage, 3],
    ]
  );
  export const SubstatWeightTotal: number = Array.from(SubstatWeights.values()).reduce((a, b) => a + b, 0);
  export const Substats: ReadonlyArray<Stat> = Array.from(SubstatWeights.keys());
  export function isLegalSubstat(stat: Stat): boolean {
    return SubstatWeights.has(stat);
  }
  const SubstatsAfterMainstat: Map<Stat, Set<Stat>> = new Map<Stat, Set<Stat>>();
  function getSubstatsAfterMainstat(mainstat: Stat): Set<Stat> {
    if (!SubstatsAfterMainstat.has(mainstat)) {
      const substatsWithoutMainstat: Set<Stat> = new Set<Genshin.Stat>(Genshin.Substats);
      substatsWithoutMainstat.delete(mainstat);
      SubstatsAfterMainstat.set(mainstat, substatsWithoutMainstat);
    }
    return SubstatsAfterMainstat.get(mainstat)!;
  }
  const SubstatCombinationsAfterMainstat: Map<Stat, ReadonlyArray<ReadonlyArray<Stat>>> = new Map<Stat, ReadonlyArray<ReadonlyArray<Stat>>>();
  export function getSubstatCombinationsAfterMainstat(mainstat: Stat): ReadonlyArray<ReadonlyArray<Stat>> {
    if (!SubstatCombinationsAfterMainstat.has(mainstat)) {
      const substatsAfterMainstat: Stat[] = Array.from(getSubstatsAfterMainstat(mainstat));
      const combinations: ReadonlyArray<ReadonlyArray<Stat>> =
        substatsAfterMainstat.flatMap(
          (v1, i1) => substatsAfterMainstat.slice(i1 + 1).flatMap(
            (v2, i2) => substatsAfterMainstat.slice(i1 + i2 + 2).flatMap(
              (v3, i3) => substatsAfterMainstat.slice(i1 + i2 + i3 + 3).map(v4 => [v1, v2, v3, v4])
            )
          )
        );
      SubstatCombinationsAfterMainstat.set(mainstat, combinations);
    }
    return SubstatCombinationsAfterMainstat.get(mainstat)!;
  }
  /**
   * 
   * @param stat the stat to return the substat weight for
   * @returns the substat weight of the given stat, or 0 if the given stat is not a substat.
   */
  export function getSubstatWeight(stat: Stat): number {
    return SubstatWeights.has(stat) ? SubstatWeights.get(stat)! : 0;
  }

  export enum ArtifactSet {
    GladiatorsFinale = "Gladiator's Finale",
    WanderersTroupe = "Wanderer's Troupe",
    Thundersoother = "Thundersoother",
    ThunderingFury = "Thundering Fury",
    MaidenBeloved = "Maiden Beloved",
    ViridescentVenerer = "Viridescent Venerer",
    CrimsonWitchOfFlames = "Crimson Witch of Flames",
    Lavawalker = "Lavawalker",
    NoblesseOblige = "Noblesse Oblige",
    BloodstainedChivalry = "Bloodstained Chivalry",
    ArchaicPetra = "Archaic Petra",
    RetracingBolide = "Retracing Bolide",
    BlizzardStrayer = "Blizzard Strayer",
    HeartOfDepth = "Heart of Depth",
    TenacityOfTheMillelith = "Tenacity of the Millelith",
    PaleFlame = "Pale Flame",
    EmblemOfSeveredFate = "Emblem of Severed Fate",
    ShimenawasReminiscence = "Shimenawa's Reminiscence"
  };
  export const ArtifactSets: ReadonlyArray<ArtifactSet> = Array.from(Object.values(ArtifactSet));

  export enum ResinArtifactSource {
    NormalBoss = "Normal Boss",
    WeeklyBossFirstThree = "Weekly Boss (1st 3)",
    WeeklyBoss = "Weekly Boss",
    DomainOfGuyun = "Domain of Guyun",
    MidsummerCourtyard = "Midsummer Courtyard",
    ValleyOfRemembrance = "Valley of Remembrance",
    HiddenPalaceOfZhouFormula = "Hidden Palace of Zhou Formula",
    PeakOfVindagnyr = "Peak of Vindagnyr",
    RidgeWatch = "Ridge Watch",
    MomijiDyedCourt = "Momiji-Dyed Court",
    ClearPoolAndMountainCavern = "Clear Pool and Mountain Cavern"
  }
  export const ResinArtifactSources: ReadonlyArray<ResinArtifactSource> = Array.from(Object.values(ResinArtifactSource));

  const SourceSets: Map<ResinArtifactSource, ArtifactSet[]> = new Map<ResinArtifactSource, ArtifactSet[]>();
  SourceSets.set(ResinArtifactSource.NormalBoss, [ArtifactSet.GladiatorsFinale, ArtifactSet.WanderersTroupe]);
  SourceSets.set(ResinArtifactSource.WeeklyBossFirstThree, [ArtifactSet.GladiatorsFinale, ArtifactSet.WanderersTroupe]);
  SourceSets.set(ResinArtifactSource.WeeklyBoss, [ArtifactSet.GladiatorsFinale, ArtifactSet.WanderersTroupe]);
  SourceSets.set(ResinArtifactSource.DomainOfGuyun, [ArtifactSet.ArchaicPetra, ArtifactSet.RetracingBolide]);
  SourceSets.set(ResinArtifactSource.MidsummerCourtyard, [ArtifactSet.ThunderingFury, ArtifactSet.Thundersoother]);
  SourceSets.set(ResinArtifactSource.ValleyOfRemembrance, [ArtifactSet.ViridescentVenerer, ArtifactSet.MaidenBeloved]);
  SourceSets.set(ResinArtifactSource.HiddenPalaceOfZhouFormula, [ArtifactSet.CrimsonWitchOfFlames, ArtifactSet.Lavawalker]);
  SourceSets.set(ResinArtifactSource.PeakOfVindagnyr, [ArtifactSet.BlizzardStrayer, ArtifactSet.HeartOfDepth]);
  SourceSets.set(ResinArtifactSource.RidgeWatch, [ArtifactSet.TenacityOfTheMillelith, ArtifactSet.PaleFlame]);
  SourceSets.set(ResinArtifactSource.MomijiDyedCourt, [ArtifactSet.ShimenawasReminiscence, ArtifactSet.EmblemOfSeveredFate]);
  SourceSets.set(ResinArtifactSource.ClearPoolAndMountainCavern, [ArtifactSet.BloodstainedChivalry, ArtifactSet.NoblesseOblige]);
  export function getResinArtifactSourceSets(source: ResinArtifactSource): ArtifactSet[] {
    return SourceSets.get(source)!;
  }

  const NormalBossDropRate: number = 1.0;
  const WeeklyBossDropRate: number = 1.23;
  const DomainDropRate: number = 1.065;
  export function getDropRate(source: ResinArtifactSource): number {
    switch (source) {
      case ResinArtifactSource.NormalBoss:
        return NormalBossDropRate;
      case ResinArtifactSource.WeeklyBossFirstThree:
      case ResinArtifactSource.WeeklyBoss:
        return WeeklyBossDropRate;
      default:
        return DomainDropRate;
    }
  }

  export function getResinCost(source: ResinArtifactSource): number {
    switch (source) {
      case ResinArtifactSource.NormalBoss:
        return 40;
      case ResinArtifactSource.WeeklyBossFirstThree:
        return 30;
      case ResinArtifactSource.WeeklyBoss:
        return 60;
      default:
        return 20;
    }
  }

//  const arToDomainDropRates_ = new Map();
//  arToDomainDropRates_.set("45 or higher", 1.065);
//  arToDomainDropRates_.set("40 to 44", 0.355);
//  arToDomainDropRates_.set("39 or lower", 0.0);

//  const wlToNormalBossDropRates_ = new Map();
//  wlToNormalBossDropRates_.set(8, 1.0);
//  wlToNormalBossDropRates_.set(7, 0.63);
//  wlToNormalBossDropRates_.set(6, 0.42);
//  wlToNormalBossDropRates_.set(5, 0.21);

} // end of namespace Artifact