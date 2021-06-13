import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StoreModule} from '@ngrx/store';
import * as fronmTv from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { TvEffects } from './effects/tv.effects';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreModule.forFeature(fronmTv.tvKey, fronmTv.reducer),
    EffectsModule.forFeature([TvEffects])
  ]
})
export class TvModule {}
