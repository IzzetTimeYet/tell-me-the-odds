import { Component, Input, OnInit } from '@angular/core';
import { ArtifactSet, ArtifactStat, ArtifactType, Substats } from '../artifact';
import { WishlistArtifact } from './wishlist-artifact';

@Component({
  selector: 'app-wishlist-artifact',
  templateUrl: './wishlist-artifact.component.html',
  styleUrls: ['./wishlist-artifact.component.scss']
})
export class WishlistArtifactComponent implements OnInit {
  @Input() wishlistArtifact!: WishlistArtifact/* = {
    set: ArtifactSet.PaleFlame,
    type: ArtifactType.Circlet,
    mainstat: ArtifactStat.CritRate,
    substats: [ArtifactStat.CritDamage, ArtifactStat.AtkPercent, ArtifactStat.EnergyRecharge],
    minimum: 0,
    wishlisted: false
  }*/;

  sets: ArtifactSet[] = Object.values(ArtifactSet);
  substats: ArtifactStat[] = Array.from(Substats.keys());

  iconRef(): string {
    switch (this.wishlistArtifact.type) {
      case ArtifactType.Flower:
        return '/assets/images/Icon_Flower_of_Life.png';
      case ArtifactType.Plume:
        return '/assets/images/Icon_Plume_of_Death.png';
      case ArtifactType.Sands:
        return '/assets/images/Icon_Sands_of_Eon.png';
      case ArtifactType.Goblet:
        return '/assets/images/Icon_Goblet_of_Eonothem.png';
      case ArtifactType.Circlet:
        return '/assets/images/Icon_Circlet_of_Logos.png';
      default:
        return '';
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
