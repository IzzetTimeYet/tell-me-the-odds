import { ArtifactSet, ArtifactType, ArtifactStat } from "../artifact";

export interface WishlistArtifact {
  set: ArtifactSet;
  type: ArtifactType;
  mainstat: ArtifactStat;
  substats: ArtifactStat[];
  minimum: number;
  wishlisted: boolean;
}