import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActorModule } from '@clmovies/shareds/actor/actor.module';
import { MovieModule } from '@clmovies/shareds/movie/movie.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { CarruselModule } from 'src/app/shared-ui/carrusel/carrusel.module';
import { InfiniteScrollModule } from 'src/app/shared-ui/infinite-scroll/infinite-scroll.module';
import { NoDataModule } from 'src/app/shared-ui/no-data/no-data.module';
import { SpinnerModule } from 'src/app/shared-ui/spinner/spinner.module';
import { MovieInfoComponent } from './components/movie-info.page';
import { MoviePage } from './containers/movie.page';
import { MoviesPage } from './containers/movies.page';
import { MoviePageEffects } from './effects/movie-page.effects';
import { MoviePageRoutingModule } from './movie-routing.module';

const SHARED_MODULE = [
  // SharedModule,
  MovieModule,
  ActorModule
];

const SHARED_UI_MODULE = [
  NoDataModule,
  SpinnerModule,
  CarruselModule,
  InfiniteScrollModule,
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ...SHARED_MODULE,
    ...SHARED_UI_MODULE,
    EffectsModule.forFeature([MoviePageEffects]),
    TranslateModule.forChild(),
    MoviePageRoutingModule
  ],
  declarations: [
    MoviesPage,
    MoviePage,
    MovieInfoComponent
  ]
})
export class MoviePageModule {}
