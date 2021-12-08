import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MovieModule } from '@clmovies/shareds/movie/movie.module';
import { TvModule } from '@clmovies/shareds/tv/tv.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RootComponent } from './containers/root.page';

@NgModule({
  imports: [
    CommonModule,
    TvModule,
    MovieModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule
  ],
  declarations: [
    RootComponent
  ],
  providers: [
    { provide: "windowObject", useValue: window}
  ]
})
export class CoreModule {}
