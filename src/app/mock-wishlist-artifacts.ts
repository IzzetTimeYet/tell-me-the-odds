import { Artifact } from './artifact';
import { WishlistArtifact } from './wishlist';

// export const WISHLIST_ARTIFACTS: Map<ArtifactSet, WishlistArtifact[]> = new Map<ArtifactSet, WishlistArtifact[]>();
// Object.values(ArtifactSet).forEach(artifactSet => {
//   let setWishlist: WishlistArtifact[] = [];
//   Mainstats.forEach((typeMainstats, artifactType) => {
//     typeMainstats.forEach((weight, mainstat) => {
//       setWishlist.push(new WishlistArtifact(artifactSet,artifactType, mainstat, [], false));
//     });
//   });
//   WISHLIST_ARTIFACTS.set(artifactSet, setWishlist);
// });

export const WISHLIST_ARTIFACTS: Map<Artifact.Set, WishlistArtifact[]> = new Map<Artifact.Set, WishlistArtifact[]>();
Object.values(Artifact.Set).forEach(artifactSet => {
  let setWishlist: WishlistArtifact[] = [];
  Object.values(Artifact.Type).forEach(artifactType => {
    Artifact.getMainstats(artifactType).forEach(mainstat => {
      setWishlist.push(new WishlistArtifact(artifactSet, artifactType, mainstat, [], false));
    });
  });
  WISHLIST_ARTIFACTS.set(artifactSet, setWishlist);
});