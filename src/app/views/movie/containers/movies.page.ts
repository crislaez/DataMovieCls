import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FROM, TYPE_MOVIES } from '@clmovies/shareds/utils/constants';
import { getObjectKeys, gotToTop } from '@clmovies/shareds/utils/functions';
import { IonContent } from '@ionic/angular';
import { Store } from '@ngrx/store';
import * as MoviePageActions from '../actions/movie-page.actions';
import * as fromMoviesPage from '../selectors/movies-page.selectors';

@Component({
  selector: 'app-movies.page',
  template: `
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

    <div class="empty-header components-color">
      <div class="empty-div-50"></div>
      <h1 class="text-colorr">{{'COMMON.MOVIES' | translate }}</h1>
      <div class="displays-center width-max heigth-50">
      </div>
    </div>

    <div class="container components-color">
      <ng-container *ngIf="(info$ | async) as info">
        <ng-container *ngIf="getObjectKeys(info)?.length > 0; else noData">
          <ng-container *ngFor="let key of getObjectKeys(info)">
            <app-carrusel
              [title]="key"
              [from]="FROM.MOVIE"
              [hash]="'/movie-list/' + key"
              [showButton]="info?.[key]?.list?.length > 5"
              [items]="info?.[key]?.sliderList"
              [status]="info?.[key]?.status">
            </app-carrusel>
          </ng-container>
        </ng-container>
      </ng-container>

      <!-- REFRESH -->
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'0vh'"></app-no-data>
      </ng-template>
    </div>

    <!-- TO TOP BUTTON  -->
    <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button class="back-color" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
    </ion-fab>
  </ion-content >
  `,
  styleUrls: ['./movies.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesPage {

  FROM = FROM;
  gotToTop = gotToTop;
  getObjectKeys = getObjectKeys;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  showButton = false;
  info$ = this.store.select(fromMoviesPage.selectMoviesInit);


  constructor(
    private store: Store
  ) { }


  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.store.dispatch(MoviePageActions.loadAllTypeMovies({typesMovies: TYPE_MOVIES}))
      event.target.complete();
    }, 500);
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

}
