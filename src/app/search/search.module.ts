import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SearchPageRoutingModule } from './search-routing.module';
import { SearchPage } from './containers/search.page';
import { SearchResultComponent } from './components/search-result.component';
import { SharedPageModule } from '@clmovies/shareds/shared/shared.module';
import { MovieModule } from '@clmovies/shareds/movie/movie.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedPageModule,
    MovieModule,
    SearchPageRoutingModule
  ],
  declarations: [
    SearchPage,
    SearchResultComponent
  ]
})
export class SearchPageModule {}
