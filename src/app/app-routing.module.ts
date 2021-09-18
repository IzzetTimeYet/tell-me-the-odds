import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtifactWishlistComponent } from './artifact-wishlist/artifact-wishlist.component';
import { ArtifactResinComponent } from './artifact-resin/artifact-resin.component';

const routes: Routes = [
  { path: '', redirectTo: '/wishlist', pathMatch: 'full' },
  { path: 'wishlist', component: ArtifactWishlistComponent },
  { path: 'resin-analysis', component: ArtifactResinComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
