import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ArtifactSet, ArtifactStat, Substats } from '../artifact';
import { WishlistArtifact } from '../wishlist-artifact/wishlist-artifact';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-wishlist-set',
  templateUrl: './wishlist-set.component.html',
  styleUrls: ['./wishlist-set.component.scss']
})
export class WishlistSetComponent implements OnInit {
  set?: ArtifactSet;
  setWishlist: WishlistArtifact[] = [];
  substats: ArtifactStat[] = Array.from(Substats.keys());
  displayedColumns: string[] = ['wishlisted', 'type', 'mainstat', 'substats'];

  constructor(private route: ActivatedRoute, private wishlistService: WishlistService, private location: Location) { }

  loadSet(): void {
    this.set = <ArtifactSet> this.route.snapshot.paramMap.get('set');
    this.wishlistService.getSetWishlist(this.set).subscribe(setWishlist => this.setWishlist = setWishlist);
  }

  ngOnInit(): void {
    this.loadSet();
  }

  goBack(): void {
    this.location.back();
  }
}
