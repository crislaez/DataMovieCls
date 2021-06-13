import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenrerPageRoutingModule } from './genrer-routing.module';

import { GenrerPage } from './containers/genrer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenrerPageRoutingModule
  ],
  declarations: [
    GenrerPage
  ]
})
export class GenrerPageModule {}
