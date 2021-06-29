import { Component, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tv, TvService } from '@clmovies/shareds/tv';
import { combineLatest, Observable } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { emptyObject, errorImage } from '@clmovies/shareds/shared/utils/utils';


@Component({
  selector: 'app-tv.page',
  template: `
  <ion-content [fullscreen]="true">
    <div class="container components-color">

     <ng-container *ngIf="(tv$ | async) as tv ; else loader">
      <ng-container *ngIf="emptyObject(tv); else noData">

          <!-- HEADER  -->
        <div class="header fade-in-card" no-border>
          <ion-back-button defaultHref="../" class="text-second-color" [text]="''"></ion-back-button>
          <h1 class="text-second-color">{{tv?.name}} ({{tv?.first_air_date | date: 'y'}})</h1>
          <div class="header-container-empty" ></div>
        </div>

        <ion-card class="width-max fade-in-card" >
          <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+tv?.poster_path" [alt]="tv?.poster_path" (error)="errorImage($event)"/>
        </ion-card>

        <ion-card class="width-max fade-in-card" >
          <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+tv?.backdrop_path" [alt]="tv?.poster_path" (error)="errorImage($event)"/>
        </ion-card>

        <ion-card class="width-max text-color">
          <ion-card-content>

            <div class="displays-between width-max">
              <span class="span-bold">Genres: </span>
              <span class="width-half">{{getMovieArrayData(tv?.genres)}}</span>
            </div>

            <div class="displays-between width-max margin-top">
              <span class="span-bold">Product company: </span>
              <span class="width-half">{{getMovieArrayData(tv?.production_companies)}}</span>
            </div>

            <div class="displays-between width-max margin-top">
              <span class="span-bold">Note: </span>
              <span class="width-half">{{tv?.vote_average}}</span>
            </div>

            <div class="displays-between width-max margin-top">
              <span class="span-bold">Date: </span>
              <span class="width-half">{{tv?.first_air_date | date: 'MMM d, y'}}</span>
            </div>

            <div *ngIf="tv?.homepage" class="displays-between width-max margin-top">
              <span class="span-bold">Show in web: </span>
              <a class="width-half" [href]="tv?.homepage">Here</a>
            </div>

            <div class="displays-center width-max margin-top">
              <span class="span-bold width-max">Description</span>
              <span>{{tv?.overview}}</span>
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
        <ion-spinner class="loader" color="primary"></ion-spinner>
      </ng-template>

    </div>
  </ion-content >
  `,
  styleUrls: ['./tv.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TvPage {

  emptyObject = emptyObject;
  errorImage = errorImage;
  reload$ = new EventEmitter();

  tv$: Observable<Tv> = combineLatest([
    this.route?.params,
    this.reload$.pipe(startWith(''))
  ]).pipe(
    filter(([{idTv}, ]) => !!idTv),
    switchMap(([{idTv}, ]) =>
      this._tv.getTv(idTv).pipe(
        map((tv) => (tv)),
        catchError(() => [{}])
      )
    )
  );


  constructor(private route: ActivatedRoute, private _tv: TvService) {
    // this.tv$.subscribe(data => console.log(data))
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
