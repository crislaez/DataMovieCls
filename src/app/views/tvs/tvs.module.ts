import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActorModule } from '@clmovies/shareds/actor/actor.module';
import { TvModule } from '@clmovies/shareds/tv/tv.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { CarruselModule } from 'src/app/shared-ui/carrusel/carrusel.module';
import { InfiniteScrollModule } from 'src/app/shared-ui/infinite-scroll/infinite-scroll.module';
import { NoDataModule } from 'src/app/shared-ui/no-data/no-data.module';
import { SpinnerModule } from 'src/app/shared-ui/spinner/spinner.module';
import { TvInfoComponent } from './components/tv-info.page';
import { TvPage } from './containers/tv.page';
import { TvsPage } from './containers/tvs.page';
import { TvPageEffects } from './effects/tv-page.effects';
import { TvsPageRoutingModule } from './tvs-routing.module';

const SHARED_MODULE = [
  TvModule,
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
    EffectsModule.forFeature([TvPageEffects]),
    TranslateModule.forChild(),
    TvsPageRoutingModule
  ],
  declarations: [
    TvsPage,
    TvPage,
    TvInfoComponent
  ]
})
export class TvsPageModule {}
