import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieListPage } from './containers/movie-list.page';


const routes: Routes = [
  {
    path: ':typeMovie',
    component: MovieListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovieListPageRoutingModule {}
