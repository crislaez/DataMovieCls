import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { GenrerPage } from './containers/genrer.page';
import { GenrerPageRoutingModule } from './genrer-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    // MovieModule,
    // TvModule,
    // GenreModule,
    TranslateModule.forChild(),
    GenrerPageRoutingModule
  ],
  declarations: [
    GenrerPage
  ]
})
export class GenrerPageModule {}
