import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotificationModule } from '@clmovies/shareds/notification/notification.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MovieEffects } from './effects/movie.effects';
import * as fromMovie from './reducers/movie.reducer';

@NgModule({
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fromMovie.movieFeatureKey, fromMovie.reducer),
    EffectsModule.forFeature([MovieEffects])
  ]
})
export class MovieModule {}
