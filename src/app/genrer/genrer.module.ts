import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieModule } from '@clmovies/shareds/movie/movie.module';
import { TvModule } from '@clmovies/shareds/tv/tv.module';
import { IonicModule } from '@ionic/angular';
import { GenrerPage } from './containers/genrer.page';
import { GenrerPageRoutingModule } from './genrer-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenrerPageRoutingModule,
    MovieModule,
    TvModule
  ],
  declarations: [
    GenrerPage
  ]
})
export class GenrerPageModule {}
