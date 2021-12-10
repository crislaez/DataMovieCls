import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromGenre, GenreActions } from '@clmovies/shareds/genre';
import { fromMovie } from '@clmovies/shareds/movie';
import { fromTv } from '@clmovies/shareds/tv';
import { Menu } from '@clmovies/shareds/utils/models';
import { emptyObject, errorImage, gotToTop, trackById } from '@clmovies/shareds/utils/utils/functions';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-genrer',
  template:`
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
      <div class="container components-color">

        <!-- HEADER  -->
        <div class="header" no-border>
          <ng-container *ngIf="(genre$ | async) as genre">
            <ng-container *ngIf="emptyObject(genre); else noTitle">
              <h1 class="text-second-color capital-letter">{{title}} {{genre?.name}}</h1>
            </ng-container>
          </ng-container>
          <ng-template #noTitle>
            <h1 class="text-second-color"> - </h1>
          </ng-template>
        </div>

        <ng-container *ngIf="(info$ | async) as info">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending' || statusComponent?.perPage !== 1; else loader">
              <ng-container *ngIf="status !== 'error'; else serverError">

                <ng-container *ngIf="info?.data?.length > 0; else noData">

                  <ion-card class="ion-activatable ripple-parent fade-in-card" [routerLink]="['/'+info?.genre+'/'+item?.id]" *ngFor="let item of info?.data; trackBy: trackById" >
                    <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+item?.poster_path" [alt]="item?.poster_path" (error)="errorImage($event)"/>
                    <ion-card-header>
                      <ion-card-title class="text-color">{{item?.original_title || item?.original_name}}</ion-card-title>
                    </ion-card-header>

                    <ion-card-content class="text-color">
                      {{ 'COMMON.POINTS' | translate }}: {{item?.vote_average}}
                    </ion-card-content>

                    <ion-ripple-effect></ion-ripple-effect>
                  </ion-card>

                  <!-- INFINITE SCROLL  -->
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
  styleUrls: ['./genrer.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenrerPage {

  gotToTop = gotToTop;
  trackById = trackById;
  errorImage = errorImage;
  emptyObject = emptyObject;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent;

  title: string = '';
  showButton: boolean = false;

  infiniteScroll$ = new EventEmitter<{ perPage?:number }>();
  total$ = this.store.pipe(select(fromGenre.getTotalPages));
  status$ = this.store.pipe(select(fromGenre.getStatus));

  genre$: Observable<Menu>;

  statusComponent: { perPage?:number } = {
    perPage: 1
  };


  info$: Observable<any> = combineLatest([
    this.route.params,
    this.route.queryParams,
    this.infiniteScroll$.pipe(startWith(this.statusComponent)),
  ]).pipe(
    tap(([{idGenre}, {genre}, {perPage:page}]) => {
      this.store.dispatch(GenreActions.loadGenre({page: page?.toString(), idGenre, genre}))
    }),
    switchMap(([{idGenre}, {genre}]) =>
      this.store.select(fromGenre.getGenres).pipe(
        map(data => ({data, genre, idGenre}))
      )
    )
    // ,tap(res => console.log(res))
  );


  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) { }


  ngOnInit(){
    this.store.dispatch(GenreActions.deleteGenre())
    console.log('dentro')
    this.title = this.route.snapshot?.queryParams?.genre;

    this.genre$ = this.route.params.pipe(
      switchMap(({idGenre}) => {
        if(this.title  === 'movie') return this.store.pipe(select(fromMovie.getMenuGenre(idGenre)));
        return  this.store.pipe(select(fromTv.getMenuGenre(idGenre)))
      })
    );
  }

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
