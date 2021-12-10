import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tv } from '@clmovies/shareds/utils/models';
import { emptyObject, errorImage } from '@clmovies/shareds/utils/utils/functions';
import { fromTv, TvActions } from '@clmovies/shareds/tv';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, tap } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tv.page',
  template: `
  <ion-content [fullscreen]="true">
    <div class="container components-color">

      <ng-container *ngIf="(tv$ | async) as tv ; else loader">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">

            <ng-container *ngIf="emptyObject(tv); else noData">

                <!-- HEADER  -->
              <div class="header fade-in-card" no-border>
                <ion-back-button defaultHref="/tv" class="text-second-color" [text]="''"></ion-back-button>
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
                    <span class="span-bold">{{'COMMON.GENRES' | translate }}: </span>
                    <span class="width-half">{{getMovieArrayData(tv?.genres)}}</span>
                  </div>

                  <div class="displays-between width-max margin-top">
                    <span class="span-bold">{{'COMMON.PRODUCT_COMPANY' | translate }}: </span>
                    <span class="width-half">{{getMovieArrayData(tv?.production_companies)}}</span>
                  </div>

                  <div class="displays-between width-max margin-top">
                    <span class="span-bold">{{'COMMON.NOTE' | translate }}: </span>
                    <span class="width-half">{{tv?.vote_average}}</span>
                  </div>

                  <div class="displays-between width-max margin-top">
                    <span class="span-bold">{{'COMMON.DATE' | translate }}: </span>
                    <span class="width-half">{{tv?.first_air_date | date: 'MMM d, y'}}</span>
                  </div>

                  <div *ngIf="tv?.homepage" class="displays-between width-max margin-top">
                    <span class="span-bold">{{'COMMON.SHOW_IN_WEB' | translate }}: </span>
                    <a class="width-half" [href]="tv?.homepage">{{'COMMON.HERE' | translate }}</a>
                  </div>

                  <div class="displays-center width-max margin-top">
                    <span class="span-bold width-max">{{'COMMON.DESCRIPTION' | translate }}</span>
                    <span>{{tv?.overview}}</span>
                  </div>

                </ion-card-content>
              </ion-card>
            </ng-container>

          </ng-container>
        </ng-container>
      </ng-container>
     </ng-container>

      <!-- REFRESH -->
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- IS ERROR -->
      <ng-template #serverError>
        <div class="header" no-border>
          <ion-back-button defaultHref="/tv" class="text-second-color" [text]="''"></ion-back-button>
          <div class="header-container-empty"></div>
        </div>
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
        <div class="header" no-border>
          <ion-back-button defaultHref="/tv" class="text-second-color" [text]="''"></ion-back-button>
          <div class="header-container-empty"></div>
        </div>
        <div class="error-serve">
          <span class="text-second-color">{{ 'COMMON.NORESULT' | translate }}</span>
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

  status$ = this.store.pipe(select(fromTv.getStatus));

  tv$: Observable<Tv> = combineLatest([
    this.route?.params,
    this.reload$.pipe(startWith(''))
  ]).pipe(
    filter(([{idTv}, ]) => !!idTv),
    tap(([{idTv:idSerie}, ]) =>
      this.store.dispatch(TvActions.loadTvSerie({idSerie}))
    ),
    switchMap(() =>
      this.store.select(fromTv.getTvSerie)
    )
  );


  constructor(
    private store: Store,
    private route: ActivatedRoute
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
