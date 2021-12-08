import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TvModule } from '@clmovies/shareds/tv/tv.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TvPage } from './containers/tv.page';
import { TvsPage } from './containers/tvs.page';
import { TvsPageRoutingModule } from './tvs-routing.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TvModule,
    TranslateModule.forChild(),
    TvsPageRoutingModule
  ],
  declarations: [
    TvsPage,
    TvPage
  ]
})
export class TvsPageModule {}
