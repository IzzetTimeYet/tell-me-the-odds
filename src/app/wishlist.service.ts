import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ArtifactSet } from './artifact';
import { WISHLIST_ARTIFACTS } from './mock-wishlist-artifacts';
import { MessageService } from './message.service';
import { WishlistArtifact } from './wishlist-artifact/wishlist-artifact';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  constructor(private messageService: MessageService) { }

  getWishlist(): Observable<Map<ArtifactSet, WishlistArtifact[]>> {
    const wishlist = of(WISHLIST_ARTIFACTS);
    this.messageService.add('WishlistService: fetched wishlist');
    return wishlist;
  }

  getSetWishlist(set: ArtifactSet): Observable<WishlistArtifact[]> {
    // TODO what if set is null?
    const setWishlist = WISHLIST_ARTIFACTS.get(set)!;
    this.messageService.add(`WishlistService: fetched wishlist for set '${set}'`);
    return of(setWishlist);
  }
}
