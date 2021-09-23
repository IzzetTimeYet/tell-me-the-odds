import { formatPercent } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Wishlist } from '../artifact-wishlist';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-artifact-resin',
  templateUrl: './artifact-resin.component.html',
  styleUrls: ['./artifact-resin.component.scss']
})
export class ArtifactResinComponent implements OnInit {
  readonly displayedColumns: string[] = ["source", "chance", "cost", "efficiency"];
  readonly dataSource!: Wishlist.ResinAnalysis[];
  selectedRow!: Wishlist.ResinAnalysis;

  constructor(private wishlistService: WishlistService) {
    this.dataSource = this.wishlistService.analyze();
    this.dataSource.forEach(analysis => {
      if (this.selectedRow === undefined || this.selectedRow.efficiency < analysis.efficiency) {
        this.selectedRow = analysis;
      }
    });
  }

  ngOnInit(): void {
  }

  computeRelativeEfficiency(row: Wishlist.ResinAnalysis): number {
    return this.selectedRow.efficiency == 0 ? row.efficiency : row.efficiency / this.selectedRow.efficiency;
  }

  formatPercent(value: number): string {
    return formatPercent(value, 'en-US', '1.4-4');
  }

  isSelected(row: Wishlist.ResinAnalysis): boolean {
    return row == this.selectedRow;
  }

  selectRow(row: Wishlist.ResinAnalysis) {
    this.selectedRow = row;
  }
}
