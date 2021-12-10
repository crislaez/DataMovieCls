import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { fromSearch, SearchActions } from '@clmovies/shareds/search';
import { errorImage, trackById, gotToTop, EntityStatus } from '@clmovies/shareds/utils/utils/functions';
import { IonContent, IonInfiniteScroll, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
      <div class="container components-color">

        <!-- HEADER  -->
        <div class="header" no-border>
          <ng-container *ngIf="statusComponent?.searchType === 'movie'; else tvs">
            <h1 class="text-second-color">{{'COMMON.MOVIE' | translate }}</h1>
          </ng-container>
          <ng-template #tvs>
            <h1 class="text-second-color">{{'COMMON.TV' | translate }}</h1>
          </ng-template>

          <ion-segment (ionChange)="segmentChanged($event)" value="movie">
            <ion-segment-button value="movie">
              <ion-label>{{'COMMON.MOVIE' | translate }}</ion-label>
            </ion-segment-button>
            <ion-segment-button value="tv">
              <ion-label>{{'COMMON.TV' | translate }}</ion-label>
            </ion-segment-button>
          </ion-segment>

        </div>

        <form class="form" (submit)="searchSubmit($event)" >
          <ion-searchbar class="text-second-color" [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
        </form>

          <ng-container *ngIf="(info$ | async) as info">
            <ng-container *ngIf="(status$ | async) as status">
              <ng-container *ngIf="status !== 'pending' || statusComponent?.perPage !== 1; else loader">
                <ng-container *ngIf="status !== 'error'; else serverError">
                  <ng-container *ngIf="statusComponent?.searchName">

                    <ng-container *ngIf="info?.length > 0; else noData">

                      <ion-card class="ion-activatable ripple-parent fade-in-card" [routerLink]="['/'+statusComponent?.searchType+'/'+serachResult?.id]" *ngFor="let serachResult of info; trackBy: trackById" >
                        <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+serachResult?.poster_path" [alt]="serachResult?.poster_path" (error)="errorImage($event)"/>
                        <ion-card-header>
                          <ion-card-title class="text-color">{{serachResult?.original_title || serachResult?.name }}</ion-card-title>
                        </ion-card-header>
                        <ion-card-content class="text-color">
                          {{ 'COMMON.POINTS' | translate }}: {{serachResult?.vote_average}}
                        </ion-card-content>
                        <ion-ripple-effect></ion-ripple-effect>
                      </ion-card>

                      <ng-container *ngIf="(total$ | async) as total">
                        <ng-container *ngIf="statusComponent?.perPage !== total">
                          <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, total)">
                            <ion-infinite-scroll-content class="loadingspinner">
                              <ion-spinner *ngIf="$any(status) === 'pending'" class="loadingspinner"></ion-spinner>
                            </ion-infinite-scroll-content>
                          </ion-infinite-scroll>
                        </ng-container>
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
        <ion-fab-button class="back-color color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
      </ion-fab>
    </ion-content >
  `,
  styleUrls: ['./search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPage  {

  errorImage = errorImage;
  trackById = trackById;
  gotToTop = gotToTop;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  showButton: boolean = false;

  search = new FormControl('');
  total$ = this.store.select(fromSearch.getTotalPages);
  status$ = this.store.select(fromSearch.getStatus);

  infiniteScroll$ = new EventEmitter<{perPage?:number, searchName?:string, searchType?:string}>();

  statusComponent: { perPage?:number, searchName?:string, searchType?:string } = {
    perPage: 1,
    searchName: '',
    searchType: 'movie'
  };

  info$ = this.infiniteScroll$.pipe(
    filter(({searchName}) => !!searchName),
    tap(({perPage:page, searchName, searchType}) =>
      this.store.dispatch(SearchActions.loadSearch({searchName, searchType, page: page?.toString()}))
    ),
    switchMap(() =>
      this.store.select(fromSearch.getSearchs)
    )
    ,tap(data => console.log(data))
  );


  constructor(
    private store: Store,
    public platform: Platform
  ) { }


  //FORMULARIO MOVIE
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.statusComponent = {...this.statusComponent, perPage: 1, searchName:this.search.value};
    this.infiniteScroll$.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // DELETE SEARCH TV
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.statusComponent = {...this.statusComponent, perPage: 1, searchName:''};
    this.infiniteScroll$.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

  // REFRES
  doRefresh(event) {
    setTimeout(() => {
      this.store.dispatch(SearchActions.deleteSearch())
      this.search.reset();
      this.statusComponent = {...this.statusComponent, perPage: 1, searchName:''};
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

  //SEGMENT
  segmentChanged(event): void{
    this.content.scrollToTop();
    this.search.reset();
    this.store.dispatch(SearchActions.deleteSearch())
    this.statusComponent = {...this.statusComponent, searchName:'', perPage: 1, searchType: event?.detail?.value};
    this.infiniteScroll$.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;
  }

}

