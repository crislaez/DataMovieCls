import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenrerPage } from './containers/genrer.page';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path:':idGenre',
        component: GenrerPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenrerPageRoutingModule {}
