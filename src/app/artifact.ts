export namespace Artifact {

  export enum Type {
    Flower = "Flower",
    Plume = "Plume",
    Sands = "Sands",
    Goblet = "Goblet",
    Circlet = "Circlet"
  }
  export const TypesArray: ReadonlyArray<Type> = Array.from(Object.values(Type));

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

  const TypeMainstatWeights: Map<Type, Map<Stat, number>> = new Map<Type, Map<Stat, number>>();
  TypeMainstatWeights.set(Type.Flower, new Map<Stat, number>(
    [
      [Stat.HpFlat, 1]
    ]
  ));
  TypeMainstatWeights.set(Type.Plume, new Map<Stat, number>(
    [
      [Stat.AtkFlat, 1]
    ]
  ));
  TypeMainstatWeights.set(Type.Sands, new Map<Stat, number>(
    [
      [Stat.HpPercent, 1334],
      [Stat.AtkPercent, 1333],
      [Stat.DefPercent, 1333],
      [Stat.EnergyRecharge, 500],
      [Stat.ElementalMastery, 500]
    ]
  ));
  TypeMainstatWeights.set(Type.Goblet, new Map<Stat, number>(
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
  TypeMainstatWeights.set(Type.Circlet, new Map<Stat, number>(
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
  const ReadonlyMainstatsArrays: Map<Type, ReadonlyArray<Stat>> = new Map<Type, ReadonlyArray<Stat>>();
  export function getMainstats(type: Type): ReadonlyArray<Stat> {
    if (!ReadonlyMainstatsArrays.has(type)) {
      const mainstatsArray: ReadonlyArray<Stat> = Array.from(TypeMainstatWeights.get(type)!.keys());
      ReadonlyMainstatsArrays.set(type, mainstatsArray);
    }
    return ReadonlyMainstatsArrays.get(type)!;
  }

  // Lazily-loaded map of odds of rolling each mainstat for each artifact type.
  const TypeMainstatOdds: Map<Type, Map<Stat, number>> = new Map<Type, Map<Stat, number>>();
  export function getMainstatChance(type: Type, mainstat: Stat): number {
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
  export const SubstatsArray: ReadonlyArray<Stat> = Array.from(SubstatWeights.keys());
  export function canHaveSubstat(stat: Stat): boolean {
    return SubstatWeights.has(stat);
  }
  /**
   * 
   * @param stat the stat to return the substat weight for
   * @returns the substat weight of the given stat, or 0 if the given stat is not a substat.
   */
  export function getSubstatWeight(stat: Stat): number {
    return SubstatWeights.has(stat) ? SubstatWeights.get(stat)! : 0;
  }

  export enum Set {
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
  export const SetsArray: ReadonlyArray<Set> = Array.from(Object.values(Set));

  export enum ResinSource {
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
  export const ResinSourcesArray: ReadonlyArray<ResinSource> = Array.from(Object.values(ResinSource));

  const SourceSets: Map<ResinSource, Set[]> = new Map<ResinSource, Set[]>();
  SourceSets.set(ResinSource.NormalBoss, [Set.GladiatorsFinale, Set.WanderersTroupe]);
  SourceSets.set(ResinSource.WeeklyBossFirstThree, [Set.GladiatorsFinale, Set.WanderersTroupe]);
  SourceSets.set(ResinSource.WeeklyBoss, [Set.GladiatorsFinale, Set.WanderersTroupe]);
  SourceSets.set(ResinSource.DomainOfGuyun, [Set.ArchaicPetra, Set.RetracingBolide]);
  SourceSets.set(ResinSource.MidsummerCourtyard, [Set.ThunderingFury, Set.Thundersoother]);
  SourceSets.set(ResinSource.ValleyOfRemembrance, [Set.ViridescentVenerer, Set.MaidenBeloved]);
  SourceSets.set(ResinSource.HiddenPalaceOfZhouFormula, [Set.CrimsonWitchOfFlames, Set.Lavawalker]);
  SourceSets.set(ResinSource.PeakOfVindagnyr, [Set.BlizzardStrayer, Set.HeartOfDepth]);
  SourceSets.set(ResinSource.RidgeWatch, [Set.TenacityOfTheMillelith, Set.PaleFlame]);
  SourceSets.set(ResinSource.MomijiDyedCourt, [Set.ShimenawasReminiscence, Set.EmblemOfSeveredFate]);
  SourceSets.set(ResinSource.ClearPoolAndMountainCavern, [Set.BloodstainedChivalry, Set.NoblesseOblige]);
  export function getSourceSets(source: ResinSource): Set[] {
    return SourceSets.get(source)!;
  }

  const NormalBossDropRate: number = 1.0;
  const WeeklyBossDropRate: number = 1.23;
  const DomainDropRate: number = 1.065;
  export function getDropRate(source: ResinSource): number {
    switch (source) {
      case ResinSource.NormalBoss:
        return NormalBossDropRate;
      case ResinSource.WeeklyBossFirstThree:
      case ResinSource.WeeklyBoss:
        return WeeklyBossDropRate;
      default:
        return DomainDropRate;
    }
  }

  export function getResinCost(source: ResinSource): number {
    switch (source) {
      case ResinSource.NormalBoss:
        return 40;
      case ResinSource.WeeklyBossFirstThree:
        return 30;
      case ResinSource.WeeklyBoss:
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