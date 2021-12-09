import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationModule } from '@clmovies/shareds/notification/notification.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GenreEffects } from './effects/genre.effects';
import * as fronmGenre from './reducers/genre.reducer';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fronmGenre.genreFeatureKey, fronmGenre.reducer),
    EffectsModule.forFeature([GenreEffects])
  ]
})
export class GenreModule { }
