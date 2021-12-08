import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MoviePage } from './containers/movie.page';
import { MoviePageRoutingModule } from './movie-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    MoviePageRoutingModule
  ],
  declarations: [MoviePage]
})
export class MoviePageModule {}
