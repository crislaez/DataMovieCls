import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SearchPage } from './containers/search.page';
import { SearchPageRoutingModule } from './search-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    // SharedPageModule,
    // SearchModule,
    TranslateModule.forChild(),
    SearchPageRoutingModule
  ],
  declarations: [
    SearchPage
  ]
})
export class SearchPageModule {}
