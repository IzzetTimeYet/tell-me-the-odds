import { Genshin } from "./genshin";

export interface Wishlist {
  items: Wishlist.Item[];
  // filter: Wishlist.Filter;
  /** @todo functions */
}

export namespace Wishlist {
  export interface Item {
    set: Genshin.ArtifactSet;
    type: Genshin.ArtifactType;
    mainstat: Genshin.Stat;
    requiredSubstats: Genshin.Stat[];
    // wishlisted: boolean;
  }

  export interface Filter {
    sets: Genshin.ArtifactSet[];
    types: Genshin.ArtifactType[];
    sandsMainstats: Genshin.Stat[];
    gobletMainstats: Genshin.Stat[];
    circletMainstats: Genshin.Stat[];
  }

  export interface ResinAnalysis {
    source: Genshin.ResinArtifactSource;
    chance: number;
    cost: number;
    efficiency: number;
  }
}