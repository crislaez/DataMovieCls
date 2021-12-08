import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fronMovie, Movie, MovieService } from '@clmovies/shareds/movie';
import { emptyObject, errorImage } from '@clmovies/shareds/shared/utils/utils';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-movie',
  template: `
    <ion-content [fullscreen]="true">
      <div class="container components-color">

       <ng-container *ngIf="(movie$ | async) as movie ; else loader">
        <ng-container *ngIf="emptyObject(movie); else noData">

            <!-- HEADER  -->
          <div class="header fade-in-card" no-border>
            <ion-back-button defaultHref="../" class="text-second-color" [text]="''"></ion-back-button>
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
                <span class="span-bold">{{'COMMON.GENRES' | translate }}: </span>
                <span class="width-half">{{getMovieArrayData(movie?.genres)}}</span>
              </div>

              <div class="displays-between width-max margin-top">
                <span class="span-bold">{{'COMMON.PRODUCT_COMPANY' | translate }}: </span>
                <span class="width-half">{{getMovieArrayData(movie?.production_companies)}}</span>
              </div>

              <div class="displays-between width-max margin-top">
                <span class="span-bold">{{'COMMON.NOTE' | translate }}: </span>
                <span class="width-half">{{movie?.vote_average}}</span>
              </div>

              <div class="displays-between width-max margin-top">
                <span class="span-bold">{{'COMMON.DATE' | translate }}: </span>
                <span class="width-half">{{movie?.release_date | date: 'MMM d, y'}}</span>
              </div>

              <div *ngIf="movie?.homepage" class="displays-between width-max margin-top">
                <span class="span-bold">{{'COMMON.SHOW_IN_WEB' | translate }}: </span>
                <a class="width-half" [href]="movie?.homepage">{{'COMMON.HERE' | translate }}</a>
              </div>

              <div class="displays-center width-max margin-top">
                <span class="span-bold width-max">{{'COMMON.DESCRIPTION' | translate }}</span>
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

        <!-- IS ERROR -->
        <ng-template #serverError>
          <div class="error-serve">
            <div>
              <span><ion-icon class="text-second-color big-size" name="cloud-offline-outline"></ion-icon></span>
              <br>
              <span class="text-second-color">{{'COMMON.ERROR' | translate }}</span>
            </div>
          </div>
        </ng-template>

        <!-- IS NO DATA  -->
        <ng-template #noData>
          <div class="error-serve">
            <span class="text-second-color">{{'COMMON.NORESULT' | translate }}</span>
          </div>
        </ng-template>

        <!-- LOADER  -->
        <ng-template #loader>
          <ion-spinner class="loadingspinner"></ion-spinner>
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
  status$ = this.store.pipe(select(fronMovie.getStatus));

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


  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private _movie: MovieService
  ) { }


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
