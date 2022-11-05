import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TvListPage } from './containers/tv-list.page';


const routes: Routes = [
  {
    path: ':typeTv',
    component: TvListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TvListPageRoutingModule {}
