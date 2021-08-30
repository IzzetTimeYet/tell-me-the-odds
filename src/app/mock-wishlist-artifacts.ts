import { ArtifactSet, ArtifactType, Mainstats } from './artifact';
import { WishlistArtifact } from './wishlist-artifact/wishlist-artifact';

export const WISHLIST_ARTIFACTS: Map<ArtifactSet, WishlistArtifact[]> = new Map<ArtifactSet, WishlistArtifact[]>();
Object.values(ArtifactSet).forEach(artifactSet => {
  let setWishlist: WishlistArtifact[] = [];
  Mainstats.forEach((typeMainstats, artifactType) => {
    typeMainstats.forEach((weight, mainstat) => {
      setWishlist.push({
        set: artifactSet,
        type: artifactType,
        mainstat: mainstat,
        substats: [],
        //minimum: 0,
        wishlisted: false
      });
    });
  });
  WISHLIST_ARTIFACTS.set(artifactSet, setWishlist);
});