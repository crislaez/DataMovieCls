import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MovieModule } from '@clmovies/shareds/movie/movie.module';
import { SharedPageModule } from '@clmovies/shareds/shared/shared.module';
import { TvModule } from '@clmovies/shareds/tv/tv.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SearchResultComponent } from './components/search-result.component';
import { SearchPage } from './containers/search.page';
import { SearchPageRoutingModule } from './search-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedPageModule,
    MovieModule,
    TvModule,
    TranslateModule.forChild(),
    SearchPageRoutingModule
  ],
  declarations: [
    SearchPage,
    SearchResultComponent
  ]
})
export class SearchPageModule {}
