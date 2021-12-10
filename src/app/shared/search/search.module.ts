import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationModule } from '@clmovies/shareds/notification/notification.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SearchEffects } from './effects/search.effects';
import * as fronmSearch from './reducers/search.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationModule,
    StoreModule.forFeature(fronmSearch.searchFeatureKey, fronmSearch.reducer),
    EffectsModule.forFeature([SearchEffects])
  ]
})
export class SearchModule { }
