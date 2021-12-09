import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GenreModule } from '@clmovies/shareds/genre/genre.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenrerPage } from './containers/genrer.page';
import { GenrerPageRoutingModule } from './genrer-routing.module';
import { MovieModule } from '@clmovies/shareds/movie/movie.module';
import { TvModule } from '@clmovies/shareds/tv/tv.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    // MovieModule,
    // TvModule,
    GenreModule,
    TranslateModule.forChild(),
    GenrerPageRoutingModule
  ],
  declarations: [
    GenrerPage
  ]
})
export class GenrerPageModule {}
