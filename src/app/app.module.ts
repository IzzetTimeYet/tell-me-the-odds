import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessagesComponent } from './messages/messages.component';
import { ArtifactWishlistComponent } from './artifact-wishlist/artifact-wishlist.component';
import { ArtifactResinComponent } from './artifact-resin/artifact-resin.component';

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    ArtifactWishlistComponent,
    ArtifactResinComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatGridListModule,
    MatExpansionModule,
    MatListModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [{provide: LOCALE_ID, useValue: "en-US"}],
  bootstrap: [AppComponent]
})
export class AppModule { }
