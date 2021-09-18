import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Artifact } from '../artifact';
import { Wishlist } from '../artifact-wishlist';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-artifact-wishlist',
  templateUrl: './artifact-wishlist.component.html',
  styleUrls: ['./artifact-wishlist.component.scss']
})
export class ArtifactWishlistComponent implements OnInit, AfterViewInit {
  readonly displayedColumns: string[] = ['wishlisted', 'set', 'type', 'mainstat', 'substats'];
  readonly sets: ReadonlyArray<Artifact.Set> = Artifact.SetsArray;
  readonly types: ReadonlyArray<Artifact.Type> = Artifact.TypesArray;
  readonly sandsMainstats: ReadonlyArray<Artifact.Stat> = Artifact.getMainstats(Artifact.Type.Sands);
  readonly gobletMainstats: ReadonlyArray<Artifact.Stat> = Artifact.getMainstats(Artifact.Type.Goblet);
  readonly circletMainstats: ReadonlyArray<Artifact.Stat> = Artifact.getMainstats(Artifact.Type.Circlet);
  readonly substats: ReadonlyArray<Artifact.Stat> = Artifact.SubstatsArray;
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  readonly dataSource: MatTableDataSource<Wishlist.Item> = new MatTableDataSource<Wishlist.Item>();
  readonly wishlistFilter!: Wishlist.Filter;

  constructor(private wishlistService: WishlistService) {
    this.dataSource.data = this.wishlistService.getWishlistItems();
    this.dataSource.filterPredicate = this.createFilter();
    this.wishlistFilter = this.wishlistService.getWishlistFilter();
    this.dataSource.filter = JSON.stringify(this.wishlistFilter);
  }

  private createFilter(): (item: Wishlist.Item, filter: string) => boolean {
    const filterFunction = function (item: Wishlist.Item, filter: string): boolean {
      const wishlistFilter = <Wishlist.Filter> JSON.parse(filter);
      const matchesSets = wishlistFilter.sets.length == 0 || wishlistFilter.sets.includes(item.set);
      const matchesTypes = wishlistFilter.types.length == 0 || wishlistFilter.types.includes(item.type);
      let matchesMainstats = true;
      switch (item.type) {
        case Artifact.Type.Sands:
          matchesMainstats = wishlistFilter.sandsMainstats.length == 0 || wishlistFilter.sandsMainstats.includes(item.mainstat);
          break;
        case Artifact.Type.Goblet:
          matchesMainstats = wishlistFilter.gobletMainstats.length == 0 || wishlistFilter.gobletMainstats.includes(item.mainstat);
          break;
        case Artifact.Type.Circlet:
          matchesMainstats = wishlistFilter.circletMainstats.length == 0 || wishlistFilter.circletMainstats.includes(item.mainstat);
          break;
      }
      return matchesSets && matchesTypes && matchesMainstats;
    };
    return filterFunction;
  }

  updateFilters(): void {
    this.dataSource.filter = JSON.stringify(this.wishlistFilter);
    this.updateWishlist();
  }

  updateWishlist(): void {
    this.wishlistService.updateWishlist();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
