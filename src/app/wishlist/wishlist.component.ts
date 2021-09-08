import { Component, OnInit } from '@angular/core';
import { WishlistArtifact } from '../wishlist';
import { WishlistService } from '../wishlist.service';
import { Artifact } from '../artifact';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  // wishlist: Map<ArtifactSet, WishlistArtifact[]> = new Map<ArtifactSet, WishlistArtifact[]>();
  sets: Artifact.Set[] = Object.values(Artifact.Set);
  // setWishlists: Map<ArtifactSet, WishlistArtifact[]> = new Map<ArtifactSet, WishlistArtifact[]>();
  
  constructor(private wishlistService: WishlistService) { }

  // loadWishlist(): void {
  //   this.wishlistService.getWishlist().subscribe(wishlist => this.wishlist = wishlist);
  // }

  // getSetWishlist(set: ArtifactSet): WishlistArtifact[] {
  //   // if (!this.setWishlists.has(set)) {
  //   //   let setWishlist: WishlistArtifact[] = [];
  //   //   this.wishlist.forEach(wishlistArtifact => {
  //   //     if (wishlistArtifact.set == set) {
  //   //       setWishlist.push(wishlistArtifact);
  //   //     }
  //   //   });
  //   //   this.setWishlists.set(set, setWishlist);
  //   // }
  //   // return this.setWishlists.get(set)!;
  //   return this.wishlist.get(set)!;
  // }

  ngOnInit(): void {
    // this.loadWishlist();
  }
}
