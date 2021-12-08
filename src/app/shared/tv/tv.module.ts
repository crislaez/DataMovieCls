import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotificationModule } from '@clmovies/shareds/notification/notification.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TvEffects } from './effects/tv.effects';
import * as fronmTv from './reducers/tv.reducer';

@NgModule({
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fronmTv.tvFeatureKey, fronmTv.reducer),
    EffectsModule.forFeature([TvEffects])
  ]
})
export class TvModule {}
