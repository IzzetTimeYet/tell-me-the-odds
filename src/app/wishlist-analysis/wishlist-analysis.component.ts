import { Component, OnInit } from '@angular/core';
import { formatPercent } from "@angular/common";
import { Artifact } from '../artifact';
import { Wishlist, WishlistArtifact } from '../wishlist';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-wishlist-analysis',
  templateUrl: './wishlist-analysis.component.html',
  styleUrls: ['./wishlist-analysis.component.scss']
})
export class WishlistAnalysisComponent implements OnInit {
  wishlist?: Map<Artifact.Set, WishlistArtifact[]>;
  wishlistAnalyses: Wishlist.SourceAnalysis[] = [];
  displayedColumns: string[] = ["source", "chance"];

  constructor(private wishlistService: WishlistService) { }

  loadWishlist(): void {
    this.wishlistService.getWishlist().subscribe(wishlist => {
      this.wishlist = wishlist;
      this.wishlistAnalyses = Wishlist.analyzeWishlist(this.wishlist);
    });
  }

  ngOnInit(): void {
    this.loadWishlist();
  }

  formatAnalysisChance(analysis: Wishlist.SourceAnalysis): string {
    return formatPercent(analysis.chance, 'en-US', '1.4-4');
  }
}
