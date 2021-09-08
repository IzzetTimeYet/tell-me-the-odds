import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Artifact } from '../artifact';
import { WishlistArtifact } from '../wishlist';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-wishlist-set',
  templateUrl: './wishlist-set.component.html',
  styleUrls: ['./wishlist-set.component.scss']
})
export class WishlistSetComponent implements OnInit {
  set?: Artifact.Set;
  setWishlist: WishlistArtifact[] = [];
  substats: Artifact.Stat[] = Artifact.createSubstatsArray();
  displayedColumns: string[] = ['wishlisted', 'type', 'mainstat', 'substats'/*, 'chance'*/];

  constructor(private route: ActivatedRoute, private wishlistService: WishlistService, private location: Location) { }

  loadSet(): void {
    this.set = <Artifact.Set> this.route.snapshot.paramMap.get('set');
    this.wishlistService.getSetWishlist(this.set).subscribe(setWishlist => this.setWishlist = setWishlist);
  }

  ngOnInit(): void {
    this.loadSet();
  }

  goBack(): void {
    this.location.back();
  }
}
