import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WishlistComponent } from './wishlist/wishlist.component';
import { WishlistSetComponent } from './wishlist-set/wishlist-set.component';

const routes: Routes = [
  { path: '', redirectTo: '/wishlist', pathMatch: 'full' },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'wishlist/:set', component: WishlistSetComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
