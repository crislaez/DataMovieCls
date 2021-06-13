import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TvsPageRoutingModule } from './tvs-routing.module';
import { TvsPage } from './containers/tvs.page';
import { TvPage } from './containers/tv.page';

import { TvModule } from '@clmovies/shareds/tv/tv.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TvModule,
    TvsPageRoutingModule
  ],
  declarations: [
    TvsPage,
    TvPage
  ]
})
export class TvsPageModule {}
