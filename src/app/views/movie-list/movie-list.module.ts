import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MovieModule } from '@clmovies/shareds/movie/movie.module';
import { SharedModule } from '@clmovies/shareds/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FilterModalModule } from 'src/app/shared-ui/filter-modal/filter-modal.module';
import { InfiniteScrollModule } from 'src/app/shared-ui/infinite-scroll/infinite-scroll.module';
import { ItemCardModule } from 'src/app/shared-ui/item-card/item-card.module';
import { NoDataModule } from 'src/app/shared-ui/no-data/no-data.module';
import { SpinnerModule } from 'src/app/shared-ui/spinner/spinner.module';
import { MovieListPage } from './containers/movie-list.page';
import { MovieListPageRoutingModule } from './movie-list-routing.module';

const SHARED_MODULE = [
  MovieModule,
  SharedModule
];

const SHARED_UI_MODULE = [
  NoDataModule,
  SpinnerModule,
  ItemCardModule,
  FilterModalModule,
  InfiniteScrollModule,
];


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ...SHARED_MODULE,
    ...SHARED_UI_MODULE,
    TranslateModule.forChild(),
    MovieListPageRoutingModule
  ],
  declarations: [MovieListPage]
})
export class MovieListPageModule {}
