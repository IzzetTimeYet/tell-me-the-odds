import { Component, Input, OnInit } from '@angular/core';
import { Artifact } from '../artifact';
import { WishlistArtifact } from '../wishlist';

@Component({
  selector: 'app-wishlist-artifact',
  templateUrl: './wishlist-artifact.component.html',
  styleUrls: ['./wishlist-artifact.component.scss']
})
export class WishlistArtifactComponent implements OnInit {
  @Input() artifact!: WishlistArtifact;

  sets: Artifact.Set[] = Object.values(Artifact.Set);
  substats: Artifact.Stat[] = Artifact.createSubstatsArray();

  iconRef(): string {
    switch (this.artifact.type) {
      case Artifact.Type.Flower:
        return '/assets/images/Icon_Flower_of_Life.png';
      case Artifact.Type.Plume:
        return '/assets/images/Icon_Plume_of_Death.png';
      case Artifact.Type.Sands:
        return '/assets/images/Icon_Sands_of_Eon.png';
      case Artifact.Type.Goblet:
        return '/assets/images/Icon_Goblet_of_Eonothem.png';
      case Artifact.Type.Circlet:
        return '/assets/images/Icon_Circlet_of_Logos.png';
      default:
        return '';
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
