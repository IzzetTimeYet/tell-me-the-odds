import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WishlistComponent } from './wishlist/wishlist.component';
import { WishlistSetComponent } from './wishlist-set/wishlist-set.component';
import { WishlistAnalysisComponent } from './wishlist-analysis/wishlist-analysis.component';

const routes: Routes = [
  { path: '', redirectTo: '/wishlist', pathMatch: 'full' },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'wishlist/:set', component: WishlistSetComponent },
  { path: 'wishlist-analysis', component: WishlistAnalysisComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
