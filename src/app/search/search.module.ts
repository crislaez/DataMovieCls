import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchModule } from '@clmovies/shareds/search/search.module';
import { SharedPageModule } from '@clmovies/shareds/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SearchPage } from './containers/search.page';
import { SearchPageRoutingModule } from './search-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedPageModule,
    SearchModule,
    TranslateModule.forChild(),
    SearchPageRoutingModule
  ],
  declarations: [
    SearchPage
  ]
})
export class SearchPageModule {}
