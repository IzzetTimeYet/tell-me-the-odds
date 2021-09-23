import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Genshin } from '../genshin';
import { Wishlist } from '../artifact-wishlist';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-artifact-wishlist',
  templateUrl: './artifact-wishlist.component.html',
  styleUrls: ['./artifact-wishlist.component.scss']
})
export class ArtifactWishlistComponent implements OnInit, AfterViewInit {
  readonly displayedColumns: string[] = [/*'wishlisted', */'set', 'type', 'mainstat', 'substats', 'remove'];
  readonly sets: ReadonlyArray<Genshin.ArtifactSet> = Genshin.ArtifactSets;
  readonly types: ReadonlyArray<Genshin.ArtifactType> = Genshin.ArtifactTypes;
  readonly sandsMainstats: ReadonlyArray<Genshin.Stat> = Genshin.getMainstats(Genshin.ArtifactType.Sands);
  readonly gobletMainstats: ReadonlyArray<Genshin.Stat> = Genshin.getMainstats(Genshin.ArtifactType.Goblet);
  readonly circletMainstats: ReadonlyArray<Genshin.Stat> = Genshin.getMainstats(Genshin.ArtifactType.Circlet);
  readonly substats: ReadonlyArray<Genshin.Stat> = Genshin.Substats;
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  readonly dataSource: MatTableDataSource<Wishlist.Item> = new MatTableDataSource<Wishlist.Item>();
  readonly wishlistFilter: Wishlist.Filter = { sets: [], types: [], sandsMainstats: [], gobletMainstats: [], circletMainstats: [] };

  constructor(private wishlistService: WishlistService, public dialog: MatDialog) {
    this.dataSource.data = this.wishlistService.getWishlistItems();
    this.dataSource.filterPredicate = this.createFilter();
    //this.wishlistFilter = this.wishlistService.getWishlistFilter();
    this.dataSource.filter = JSON.stringify(this.wishlistFilter);
  }

  private createFilter(): (item: Wishlist.Item, filter: string) => boolean {
    const filterFunction = function (item: Wishlist.Item, filter: string): boolean {
      const wishlistFilter = <Wishlist.Filter> JSON.parse(filter);
      const matchesSets = wishlistFilter.sets.length == 0 || wishlistFilter.sets.includes(item.set);
      const matchesTypes = wishlistFilter.types.length == 0 || wishlistFilter.types.includes(item.type);
      let matchesMainstats = true;
      switch (item.type) {
        case Genshin.ArtifactType.Sands:
          matchesMainstats = wishlistFilter.sandsMainstats.length == 0 || wishlistFilter.sandsMainstats.includes(item.mainstat);
          break;
        case Genshin.ArtifactType.Goblet:
          matchesMainstats = wishlistFilter.gobletMainstats.length == 0 || wishlistFilter.gobletMainstats.includes(item.mainstat);
          break;
        case Genshin.ArtifactType.Circlet:
          matchesMainstats = wishlistFilter.circletMainstats.length == 0 || wishlistFilter.circletMainstats.includes(item.mainstat);
          break;
      }
      return matchesSets && matchesTypes && matchesMainstats;
    };
    return filterFunction;
  }

  updateFilters(): void {
    this.dataSource.filter = JSON.stringify(this.wishlistFilter);
    // this.updateWishlist();
  }

  clearFilters(): void {
    this.wishlistFilter.sets = [];
    this.wishlistFilter.types = [];
    this.wishlistFilter.sandsMainstats = [];
    this.wishlistFilter.gobletMainstats = [];
    this.wishlistFilter.circletMainstats = [];
    this.updateFilters();
  }

  // updateWishlist(): void {
  //   this.wishlistService.updateWishlist();
  // }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  formatRequiredSubstats(artifact: Wishlist.Item): string {
    if (artifact.requiredSubstats.length == 0) {
      return "(none)";
    }
    let text = "";
    for (let i = 0; i < artifact.requiredSubstats.length; ++i) {
      if (i > 0) text += ", ";
      text += artifact.requiredSubstats[i];
    }
    return text;
  }

  openNewDialog(): void {
    const dialogRef = this.dialog.open(ArtifactWishlistDialog, {
      height: "fit-content",
      width: "fit-content",
      data: { requiredSubstats: [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.wishlistService.add(result);
        //this.wishlistService.getWishlistItems().unshift(result);
        this.dataSource.data = [...this.wishlistService.getWishlistItems()];
        //this.wishlistService.updateWishlist();
      }
    });
  }

  removeFromWishlist(artifact: Wishlist.Item): void {
    if (this.wishlistService.remove(artifact)) this.dataSource.data = [...this.wishlistService.getWishlistItems()];
  }

  // openEditorDialog(wishlistItem: Wishlist.Item): void {
  //   const dialogRef = this.dialog.open(ArtifactWishlistDialog, {
  //     height: "fit-content",
  //     width: "fit-content",
  //     data: {
  //       artifactToEdit: wishlistItem,
  //       set: wishlistItem.set,
  //       type: wishlistItem.type,
  //       mainstat: wishlistItem.mainstat,
  //       requiredSubstats: Array.from(wishlistItem.requiredSubstats),
  //       wishlisted: wishlistItem.wishlisted
  //     }
  //   });

  //   //const dialog
  //   // dialogRef.afterClosed().subscribe(result => {
  //   //   if (result != undefined) {
  //   //     this.dataSource.data.push(result);
  //   //     this.dataSource.data = [...this.dataSource.data];
  //   //     this.updateWishlist();
  //   //   }
  //   // });
  // }
}

interface ArtifactDialogData {
  //artifactToEdit?: Wishlist.Item;
  set?: Genshin.ArtifactSet;
  type?: Genshin.ArtifactType;
  mainstat?: Genshin.Stat;
  requiredSubstats: Genshin.Stat[];
}

@Component({
  selector: 'app-artifact-wishlist-dialog',
  templateUrl: './artifact-wishlist-dialog.component.html',
  styleUrls: ['./artifact-wishlist.component.scss']
})
export class ArtifactWishlistDialog {
  readonly sets: ReadonlyArray<Genshin.ArtifactSet> = Genshin.ArtifactSets;
  readonly types: ReadonlyArray<Genshin.ArtifactType> = Genshin.ArtifactTypes;
  readonly sandsMainstats: ReadonlyArray<Genshin.Stat> = Genshin.getMainstats(Genshin.ArtifactType.Sands);
  readonly gobletMainstats: ReadonlyArray<Genshin.Stat> = Genshin.getMainstats(Genshin.ArtifactType.Goblet);
  readonly circletMainstats: ReadonlyArray<Genshin.Stat> = Genshin.getMainstats(Genshin.ArtifactType.Circlet);
  readonly substats: ReadonlyArray<Genshin.Stat> = Genshin.Substats;
  disableMainstat: boolean = true;
  disableSubstats: boolean = true;

  constructor(public dialogRef: MatDialogRef<ArtifactWishlistDialog>, @Inject(MAT_DIALOG_DATA) public data: ArtifactDialogData) {

  }

  updateFormFields(): void {
    switch (this.data.type) {
      case Genshin.ArtifactType.Flower:
        this.data.mainstat = Genshin.Stat.HpFlat;
        this.disableMainstat = false;
        break;
      case Genshin.ArtifactType.Plume:
        this.data.mainstat = Genshin.Stat.AtkFlat;
        this.disableMainstat = false;
        break;
      case Genshin.ArtifactType.Sands:
      case Genshin.ArtifactType.Goblet:
      case Genshin.ArtifactType.Circlet:
        this.disableMainstat = false;
        if (this.data.mainstat != undefined && !this.getMainstats().includes(this.data.mainstat)) this.data.mainstat = undefined;
        break;
      default:
        this.disableMainstat = true;
    }
    //console.log(`type = ${this.data.type}, mainstat = ${this.data.mainstat}`);
    //this.disableSubstats = false;
    if (this.data.mainstat != undefined) {
      const index = this.data.requiredSubstats.indexOf(this.data.mainstat);
      //console.log(`index = ${index}`)
      if (index != -1) {
        this.data.requiredSubstats.splice(index, 1);
        this.data.requiredSubstats = Array.from(this.data.requiredSubstats); // bad way, but dunno how else
      }
    }
    this.disableSubstats = this.data.type === undefined || this.data.mainstat === undefined;
    //console.log(`requiredSubstats = ${this.data.requiredSubstats}`);
  }

  getMainstats(): ReadonlyArray<Genshin.Stat> {
    switch (this.data.type) {
      case Genshin.ArtifactType.Flower:
        return [Genshin.Stat.HpFlat];
      case Genshin.ArtifactType.Plume:
        return [Genshin.Stat.AtkFlat];
      case Genshin.ArtifactType.Sands:
        return this.sandsMainstats;
      case Genshin.ArtifactType.Goblet:
        return this.gobletMainstats;
      case Genshin.ArtifactType.Circlet:
        return this.circletMainstats;
      default:
        return [];
    }
  }

  isValidArtifact(): boolean {
    return this.data.set != undefined && this.data.type != undefined && this.data.mainstat != undefined;
  }

  createWishlistArtifact(): Wishlist.Item | undefined {
    if (this.isValidArtifact()) {
      return {
        set: this.data.set!,
        type: this.data.type!,
        mainstat: this.data.mainstat!,
        requiredSubstats: this.data.requiredSubstats/*,
        wishlisted: true*/
      };
    }
    return undefined;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // onRemoveClick(): Wishlist.Item | undefined {
  //   return this.data.artifactToEdit;
  // }

  // updateWishlistArtifact(): boolean {
  //   if (this.data.artifactToEdit != undefined && this.isValidArtifact()) {
  //     this.data.artifactToEdit.set = this.data.set!;
      
  //     return true;
  //   }
  //   return false;
  // }
}