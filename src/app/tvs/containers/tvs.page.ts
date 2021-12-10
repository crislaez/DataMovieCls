import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { errorImage, gotToTop, trackById } from '@clmovies/shareds/utils/utils/functions';
import { fromTv, TvActions } from '@clmovies/shareds/tv';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { startWith, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-tvs',
  template: `
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
    <div class="container components-color">

      <div class="div-header-fixed header">
        <!-- HEADER  -->
        <div class="div-center margin-top" no-border>
          <h1 class="text-second-color">{{'COMMON.TVS' | translate }}</h1>
        </div>

        <!-- Disabled Segment -->
        <ion-segment slot="fixed" (ionChange)="segmentChanged($event)" value="popular">
          <ion-segment-button value="popular">
            <ion-label>{{'COMMON.POPULAR' | translate }}</ion-label>
          </ion-segment-button>
          <ion-segment-button value="top_rated">
            <ion-label>{{'COMMON.TOP_RATED' | translate }}</ion-label>
          </ion-segment-button>
          <ion-segment-button value="on_the_air">
            <ion-label>{{'COMMON.ON_AIR' | translate }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <div class="header">
      </div>

      <ng-container *ngIf="(tvs$ | async) as tvs;">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending' || statusComponent?.perPage !== 1; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">

              <ng-container *ngIf="tvs?.length > 0; else noData">
                <ion-card class="ion-activatable ripple-parent fade-in-card" [routerLink]="['/tv/'+tv?.id]" *ngFor="let tv of tvs; trackBy: trackById" >
                  <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+tv?.poster_path" [alt]="tv?.poster_path" (error)="errorImage($event)"/>

                  <ion-card-header>
                    <ion-card-title class="text-color">{{tv?.name}}</ion-card-title>
                  </ion-card-header>
                  <ion-card-content class="text-color">
                  {{'COMMON.POINTS' | translate }}: {{tv?.vote_average}}
                  </ion-card-content>
                  <ion-ripple-effect></ion-ripple-effect>
                </ion-card>

                <ng-container *ngIf="(total$ | async) as total">
                  <ng-container *ngIf="statusComponent?.perPage !== total">
                    <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, total)">
                      <ion-infinite-scroll-content class="loadingspinner">
                        <ion-spinner *ngIf="status === 'pending'" class="loadingspinner"></ion-spinner>
                      </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                  </ng-container>
                </ng-container>

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

      <!-- TO TOP BUTTON  -->
      <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button class="back-color" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
      </ion-fab>
  </ion-content >
  `,
  styleUrls: ['./tvs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TvsPage {

  gotToTop = gotToTop;
  trackById = trackById;
  errorImage = errorImage;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent;

  showButton: boolean = false;
  infiniteScroll$ = new EventEmitter<{perPage?:number, typeTv?:string}>();
  statusComponent: { perPage?:number, typeTv?:string } = {
    perPage: 1,
    typeTv: 'popular',
  };

  total$ = this.store.pipe(select(fromTv.getTotalPages))
  status$ = this.store.pipe(select(fromTv.getStatus))

  tvs$ = this.infiniteScroll$.pipe(
    startWith(this.statusComponent),
    tap(({perPage:page, typeTv}) =>
      this.store.dispatch(TvActions.loadTvs({typeTv, page: page.toString()}))
    ),
    switchMap(() =>
      this.store.pipe(select(fromTv.getTvs))
    )
    // ,tap(res => console.log(res))
  );



  constructor(
    private store: Store
  ) { }


  segmentChanged(event): void{
    this.store.dispatch(TvActions.deleteTvs())
    this.content.scrollToTop();
    this.statusComponent = {...this.statusComponent, perPage: 1, typeTv: event?.detail?.value };
    this.infiniteScroll$.next(this.statusComponent)
  }

  doRefresh(event) {
    setTimeout(() => {
      this.statusComponent = { ...this.statusComponent, perPage: 1 };
      this.infiniteScroll$.next(this.statusComponent);
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
      event.target.complete();
    }, 500);
  }

  loadData(event, total) {
    setTimeout(() => {
      this.statusComponent = {...this.statusComponent, perPage: this.statusComponent?.perPage + 1};

      if(this.statusComponent?.perPage > total){
        if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
      }

      this.infiniteScroll$.next(this.statusComponent);
      event.target.complete();
    }, 500);
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }



}
