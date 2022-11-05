import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviePage } from './containers/movie.page';
import { MoviesPage } from './containers/movies.page';

const routes: Routes = [
  {
    path: '',
    children:[
        {
          path:'',
          component: MoviesPage
        },
      {
        path:':idMovie',
        component: MoviePage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviePageRoutingModule {}
