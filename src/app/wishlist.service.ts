import { Injectable } from '@angular/core';
import { Artifact } from './artifact';
import { Wishlist } from './artifact-wishlist';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private static readonly JSON_WISHLIST_KEY: string = "wishlist";
  wishlist!: Wishlist;

  constructor(private messageService: MessageService) {
    this.initializeWishlist();
  }

  private initializeWishlist(): void {
    // localStorage.clear();
    const jsonValue = localStorage.getItem(WishlistService.JSON_WISHLIST_KEY);
    if (jsonValue) {
      this.wishlist = <Wishlist> JSON.parse(jsonValue);
      this.messageService.add(`WishlistService: loaded wishlist from local storage`);
      return;
    }
    this.messageService.add(`WishlistService: wishlist was not found in local storage; creating new wishlist...`);
    const items: Wishlist.Item[] = [];
    Artifact.SetsArray.forEach(set => {
      Artifact.TypesArray.forEach(type => {
        Artifact.getMainstats(type).forEach(mainstat => {
          const item: Wishlist.Item = {set: set, type: type, mainstat: mainstat, requiredSubstats: [], wishlisted: false};
          items.push(item);
        });
      });
    });
    this.wishlist = {items: items, filter: {sets: [], types: [], sandsMainstats: [], gobletMainstats: [], circletMainstats: []}}
    this.updateWishlist();
  }

  updateWishlist(): void {
    localStorage.setItem(WishlistService.JSON_WISHLIST_KEY, JSON.stringify(this.wishlist));
    this.messageService.add(`WishlistService: updated wishlist in local storage`);
  }

  getWishlistItems(): Wishlist.Item[] {
    return this.wishlist.items;
  }

  getWishlistFilter(): Wishlist.Filter {
    return this.wishlist.filter;
  }

  analyzeResinEfficiency(): Wishlist.ResinAnalysis[] {
    this.messageService.add(`WishlistService: Analyzing wishlist for resin efficiency...`);
    const analyses: Wishlist.ResinAnalysis[] = Wishlist.analyzeResinEfficiency(this.wishlist);
    this.messageService.add(`WishlistService: Resin efficiency analysis complete.`);
    return analyses;
  }
}
