import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { fromMovie, MovieActions } from '@clmovies/shareds/movie';
import { errorImage, gotToTop, trackById } from '@clmovies/shareds/utils/utils/functions';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
      <div class="container components-color">

        <div class="div-header-fixed header">
          <!-- HEADER  -->
          <div class="div-center margin-top" no-border>
            <h1 class="text-second-color">{{'COMMON.MOVIES' | translate }}</h1>
          </div>

          <!-- Disabled Segment -->
          <ion-segment (ionChange)="segmentChanged($event)" value="popular">
            <ion-segment-button value="popular">
              <ion-label>{{ 'COMMON.POPULAR' | translate }}</ion-label>
            </ion-segment-button>
            <ion-segment-button value="top_rated">
              <ion-label>{{ 'COMMON.TOP_RATED' | translate }}</ion-label>
            </ion-segment-button>
            <ion-segment-button value="upcoming">
              <ion-label>{{ 'COMMON.UPCOMMING' | translate }}</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <div class="header">
        </div>

        <ng-container *ngIf="(movies$ | async) as movies">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending' || statusComponent?.perPage !== 1; else loader">
              <ng-container *ngIf="status !== 'error'; else serverError">

                <ng-container *ngIf="movies?.length > 0; else noData">

                  <ion-card class="ion-activatable ripple-parent fade-in-card" [routerLink]="['/movie/'+movie?.id]" *ngFor="let movie of movies; trackBy: trackById" >
                    <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+movie?.poster_path" [alt]="movie?.poster_path" (error)="errorImage($event)"/>

                    <ion-card-header>
                      <ion-card-title class="text-color">{{movie?.original_title}}</ion-card-title>
                    </ion-card-header>

                    <ion-card-content class="text-color">
                    {{ 'COMMON.POINTS' | translate }}: {{movie?.vote_average}}
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
            <span class="text-second-color">{{ 'COMMON.NORESULT' | translate }}</span>
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
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage  {

  gotToTop = gotToTop;
  trackById = trackById;
  errorImage = errorImage;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent;

  slideOpts;
  showButton: boolean = false;
  infiniteScroll$ = new EventEmitter<{perPage?:number, typeMovie?:string}>();
  statusComponent: { perPage?:number, typeMovie?:string } = {
    perPage: 1,
    typeMovie: 'popular',
  };

  total$ = this.store.pipe(select(fromMovie.getTotalPages));
  status$ = this.store.pipe(select(fromMovie.getStatus));

  movies$ = this.infiniteScroll$.pipe(
    startWith(this.statusComponent),
    tap(({perPage:page, typeMovie}) =>
      this.store.dispatch(MovieActions.loadMovies({typeMovie, page: page?.toString()}))
    ),
    switchMap(() =>
      this.store.pipe(select(fromMovie.getMovies))
    )
  );


  constructor(
    private store: Store
  ) { }


  ngOnInit(): void{
    this.slideOpts = {
      initialSlide: 0,
      speed: 400,
      slidesPerView: 'auto',
      slidesOffsetBefore: 8,
      watchOverflow: true,

    };
  }

  segmentChanged(event): void{
    this.store.dispatch(MovieActions.deleteMovies());
    this.content.scrollToTop();
    this.statusComponent = {...this.statusComponent, perPage: 1, typeMovie: event?.detail?.value };
    this.infiniteScroll$.next(this.statusComponent)
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.statusComponent = { ...this.statusComponent, perPage: 1 };
      this.infiniteScroll$.next(this.statusComponent);
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
      event.target.complete();
    }, 500);
  }

  // INIFINITE SCROLL
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
