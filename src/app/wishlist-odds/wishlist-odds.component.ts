import { Component, OnInit } from '@angular/core';
import { Artifact } from '../artifact';
import { WishlistArtifact } from '../wishlist';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-wishlist-odds',
  templateUrl: './wishlist-odds.component.html',
  styleUrls: ['./wishlist-odds.component.scss']
})
export class WishlistOddsComponent implements OnInit {
  private wishlist?: Map<Artifact.Set, WishlistArtifact[]>;
  

  constructor(private wishlistService: WishlistService) { }

  loadWishlist(): void {
    this.wishlistService.getWishlist().subscribe(wishlist => this.wishlist = wishlist);
  }

  ngOnInit(): void {
    this.loadWishlist();
  }
}
