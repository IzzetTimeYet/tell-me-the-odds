export enum ArtifactType {
  Flower = "Flower",
  Plume = "Plume",
  Sands = "Sands",
  Goblet = "Goblet",
  Circlet = "Circlet"
};

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

export enum ArtifactStat {
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

export const Mainstats: Map<ArtifactType, Map<ArtifactStat, number>> = new Map<ArtifactType, Map<ArtifactStat, number>>();
Mainstats.set(ArtifactType.Flower, new Map<ArtifactStat, number>(
  [
    [ArtifactStat.HpFlat, 1]
  ]
));
Mainstats.set(ArtifactType.Plume, new Map<ArtifactStat, number>(
  [
    [ArtifactStat.AtkFlat, 1]
  ]
));
Mainstats.set(ArtifactType.Sands, new Map<ArtifactStat, number>(
  [
    [ArtifactStat.HpPercent, 1334],
    [ArtifactStat.AtkPercent, 1333],
    [ArtifactStat.DefPercent, 1333],
    [ArtifactStat.EnergyRecharge, 500],
    [ArtifactStat.ElementalMastery, 500]
  ]
));
Mainstats.set(ArtifactType.Goblet, new Map<ArtifactStat, number>(
  [
    [ArtifactStat.HpPercent, 850],
    [ArtifactStat.AtkPercent, 850],
    [ArtifactStat.DefPercent, 800],
    [ArtifactStat.ElementalMastery, 100],
    [ArtifactStat.PyroDamage, 200],
    [ArtifactStat.ElectroDamage, 200],
    [ArtifactStat.CryoDamage, 200],
    [ArtifactStat.HydroDamage, 200],
    [ArtifactStat.AnemoDamage, 200],
    [ArtifactStat.GeoDamage, 200],
    // [ArtifactStat.DendroDamage, 200],
    [ArtifactStat.PhysicalDamage, 200]
  ]
));
Mainstats.set(ArtifactType.Circlet, new Map<ArtifactStat, number>(
  [
    [ArtifactStat.HpPercent, 1100],
    [ArtifactStat.AtkPercent, 1100],
    [ArtifactStat.DefPercent, 1100],
    [ArtifactStat.CritRate, 500],
    [ArtifactStat.CritDamage, 500],
    [ArtifactStat.HealingBonus, 500],
    [ArtifactStat.ElementalMastery, 200]
  ]
));

export const Substats: Map<ArtifactStat, number> = new Map<ArtifactStat, number>(
  [
    [ArtifactStat.HpFlat, 6],
    [ArtifactStat.HpPercent, 4],
    [ArtifactStat.AtkFlat, 6],
    [ArtifactStat.AtkPercent, 4],
    [ArtifactStat.DefFlat, 6],
    [ArtifactStat.DefPercent, 4],
    [ArtifactStat.EnergyRecharge, 4],
    [ArtifactStat.ElementalMastery, 4],
    [ArtifactStat.CritRate, 3],
    [ArtifactStat.CritDamage, 3],
  ]
);