import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActorActions, fromActor } from '@clmovies/shareds/actor';
import { fromMovie, MovieActions } from '@clmovies/shareds/movie';
import { FROM } from '@clmovies/shareds/utils/constants';
import { EntityStatus, errorImage, isNotEmptyObject } from '@clmovies/shareds/utils/functions';
import { IonContent } from '@ionic/angular';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MoviePageState } from '../models';

@Component({
  selector: 'app-movie',
  template: `
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

    <div class="empty-header components-color">
      <div class="empty-div-50"></div>
      <h1 class="text-colorr">{{ movieName }}</h1>
      <div class="displays-center width-max heigth-50">
      </div>
    </div>

    <div class="container components-color">
      <ng-container *ngIf="(movie$ | async) as movie">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">

              <ng-container *ngIf="isNotEmptyObject(movie); else noData">
                <ion-card class="width-max fade-in-card" >
                  <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+movie?.poster_path" [alt]="movie?.poster_path" (error)="errorImage($event)"/>
                </ion-card>

                <ion-card class="width-max fade-in-card" >
                  <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+movie?.backdrop_path" [alt]="movie?.poster_path" (error)="errorImage($event)"/>
                </ion-card>

                <div class="div-center margin-top-20 margin-bottom-10">
                  <h2 class="text-color-light margin-left-5">{{ 'COMMON.INFORMATION' | translate }}</h2>
                </div>

                <app-movie-info
                  [movie]="movie">
                </app-movie-info>
              </ng-container>

            </ng-container>
          </ng-container>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="(infoActors$ | async) as infoActors">
        <app-carrusel
          [title]="'COMMON.ACTORS'"
          [from]="FROM.MOVIE_ACTOR"
          [hash]="'/actor-list/movie/' + idMovie"
          [showButton]="infoActors?.actors?.length > 5"
          [items]="infoActors?.actors"
          [status]="(statusActor$ | async)">
        </app-carrusel>
      </ng-container>

      <!-- REFRESH -->
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- IS ERROR -->
      <ng-template #serverError>
        <app-no-data [title]="'COMMON.ERROR'" [image]="'assets/images/error.png'" [top]="'20vh'"></app-no-data>
      </ng-template>

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'20vh'"></app-no-data>
      </ng-template>

      <!-- LOADER  -->
      <ng-template #loader>
        <app-spinner [top]="'30%'"></app-spinner>
      </ng-template>

    </div>
  </ion-content >
  `,
  styleUrls: ['./movie.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviePage  {

  FROM = FROM
  errorImage = errorImage;
  isNotEmptyObject = isNotEmptyObject;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  showButton = false;
  idMovie: string;
  movieName: string;

  status$ = this.route.params.pipe(
    switchMap(({idMovie}) =>
      this.store.select(fromMovie.selectSingleStatus(idMovie)).pipe(
        map(status => (status || EntityStatus.Pending))
      )
    )
  );

  trigger = new EventEmitter<MoviePageState>();
  componentStatus:MoviePageState;
  movie$ = this.trigger.pipe(
    concatLatestFrom(() => this.store.select(fromMovie.selectSingleMovie)),
    tap(([{idMovie, reload}, storeMovie]) => {
      if(!storeMovie?.[idMovie] || reload){
        this.store.dispatch(MovieActions.loadMovie({idMovie}))
      }
    }),
    switchMap(([{idMovie}]) =>
      this.store.select(fromMovie.selectSingleList(idMovie)).pipe(
        tap(movie => this.movieName = movie?.original_title)
      )
    )
  );

  statusActor$ = this.route.params.pipe(
    switchMap(({idMovie}) =>
      this.store.select(fromActor.selectMovieActorStatusById(idMovie)).pipe(
        map(status => (status || EntityStatus.Pending))
      )
    )
  );

  actorTrigger = new EventEmitter<MoviePageState>();
  actorStatus: MoviePageState;
  infoActors$ = this.actorTrigger.pipe(
    concatLatestFrom(() => this.store.select(fromActor.selectMovieActorsList)),
    tap(([{idMovie:id, reload}, actorStore]) => {
      if(!actorStore?.[id] || reload){
        this.store.dispatch(ActorActions.loadActorsMovie({id: Number(id)}))
      }
    }),
    switchMap(([{idMovie}]) =>
      this.store.select(fromActor.selectMovieActorActorsById(idMovie)).pipe(
        concatLatestFrom(() => this.store.select(fromActor.selectMovieActorCrewsById(idMovie))),
        map(([actors = [], crews = []]) => ({actors, crews}))
      )
    )
  );


  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) { }


  ionViewWillEnter(): void{
    this.idMovie = this.route.snapshot.params?.idMovie || null;
    this.componentStatus = { idMovie: this.idMovie, reload: false };
    this.actorStatus = { idMovie: this.idMovie, reload: false };
    this.trigger.next(this.componentStatus);
    this.actorTrigger.next(this.actorStatus);
  }

  doRefresh(event) {
    setTimeout(() => {
      this.componentStatus = {...this.componentStatus, reload:true}
      this.trigger.next(this.componentStatus)
      event.target.complete();
    }, 500);
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }


}
