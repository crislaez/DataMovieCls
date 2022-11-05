import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActorListPage } from './containers/actor-list.page';


const routes: Routes = [
  {
    path: ':type/:id',
    component: ActorListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActorListPageRoutingModule {}
