import { Component, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie, MovieService } from '@clmovies/shareds/movie';
import { combineLatest, Observable } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { emptyObject, errorImage } from '@clmovies/shareds/shared/utils/utils';


@Component({
  selector: 'app-movie',
  template: `
    <ion-content [fullscreen]="true">
      <div class="container components-color">

       <ng-container *ngIf="(movie$ | async) as movie ; else loader">
        <ng-container *ngIf="emptyObject(movie); else noData">

            <!-- HEADER  -->
          <div class="header fade-in-card" no-border>
            <ion-back-button defaultHref="home" class="text-second-color" [text]="''"></ion-back-button>
            <h1 class="text-second-color">{{movie?.title}} ({{movie?.release_date | date: 'y'}})</h1>
            <div class="header-container-empty" ></div>
          </div>

          <ion-card class="width-max fade-in-card" >
            <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+movie?.poster_path" [alt]="movie?.poster_path" (error)="errorImage($event)"/>
          </ion-card>

          <ion-card class="width-max fade-in-card" >
            <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+movie?.backdrop_path" [alt]="movie?.poster_path" (error)="errorImage($event)"/>
          </ion-card>

          <ion-card class="width-max text-color">
            <ion-card-content>

              <div class="displays-between width-max">
                <span class="span-bold">Genres: </span>
                <span class="width-half">{{getMovieArrayData(movie?.genres)}}</span>
              </div>

              <div class="displays-between width-max margin-top">
                <span class="span-bold">Product company: </span>
                <span class="width-half">{{getMovieArrayData(movie?.production_companies)}}</span>
              </div>

              <div class="displays-between width-max margin-top">
                <span class="span-bold">Note: </span>
                <span class="width-half">{{movie?.vote_average}}</span>
              </div>

              <div class="displays-between width-max margin-top">
                <span class="span-bold">Date: </span>
                <span class="width-half">{{movie?.release_date | date: 'MMM d, y'}}</span>
              </div>

              <div *ngIf="movie?.homepage" class="displays-between width-max margin-top">
                <span class="span-bold">Show in web: </span>
                <a class="width-half" [href]="movie?.homepage">Here</a>
              </div>

              <div class="displays-center width-max margin-top">
                <span class="span-bold width-max">Description</span>
                <span>{{movie?.overview}}</span>
              </div>

            </ion-card-content>
          </ion-card>
        </ng-container>
       </ng-container>


         <!-- REFRESH -->
        <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>

        <!-- IS NO DATA  -->
        <ng-template #noData>
          <div class="error-serve">
            <span class="text-second-color">No data</span>
          </div>
        </ng-template>

        <!-- LOADER  -->
        <ng-template #loader>
          <ion-spinner color="primary"></ion-spinner>
        </ng-template>

      </div>
    </ion-content >
  `,
  styleUrls: ['./movie.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviePage  {

  emptyObject = emptyObject;
  errorImage = errorImage;
  reload$ = new EventEmitter();
  movie$: Observable<Movie> = combineLatest([
    this.route?.params,
    this.reload$.pipe(startWith(''))
  ]).pipe(
    filter(([{idMovie}, ]) => !!idMovie),
    switchMap(([{idMovie}, ]) =>
      this._movie.getMovie(idMovie).pipe(
        map((movie) => (movie)),
        catchError(() => [{}])
      )
    )
  );


  constructor(private route: ActivatedRoute, private _movie: MovieService) {
    // this.movie$.subscribe(data => console.log(data))
   }


   getMovieArrayData(movieArrayData: any): string{
     return movieArrayData.map(({name}) => (name)).join(', ');
   }

  doRefresh(event) {
    setTimeout(() => {
      this.reload$.next('')
      event.target.complete();
    }, 500);
  }


}
