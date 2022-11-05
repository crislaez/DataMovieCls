import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ActorModule } from '@clmovies/shareds/actor/actor.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActorCardModule } from 'src/app/shared-ui/actor-card/actor-card.module';
import { InfiniteScrollModule } from 'src/app/shared-ui/infinite-scroll/infinite-scroll.module';
import { NoDataModule } from 'src/app/shared-ui/no-data/no-data.module';
import { SpinnerModule } from 'src/app/shared-ui/spinner/spinner.module';
import { ActorListPageRoutingModule } from './actor-list-routing.module';
import { ActorListPage } from './containers/actor-list.page';

const SHARED_MODULE = [
  ActorModule
];

const SHARED_UI_MODULE = [
  NoDataModule,
  SpinnerModule,
  ActorCardModule,
  InfiniteScrollModule,
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ...SHARED_MODULE,
    ...SHARED_UI_MODULE,
    TranslateModule.forChild(),
    ActorListPageRoutingModule
  ],
  declarations: [
    ActorListPage
  ]
})
export class ActorListPageModule {}
