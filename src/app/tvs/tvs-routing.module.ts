import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TvsPage } from './containers/tvs.page';
import { TvPage } from './containers/tv.page';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path:'',
        component: TvsPage
      },
      {
        path:':idTv',
        component: TvPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TvsPageRoutingModule {}
