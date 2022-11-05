import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActorActions, fromActor } from '@clmovies/shareds/actor';
import { fromTv, TvActions } from '@clmovies/shareds/tv';
import { FROM } from '@clmovies/shareds/utils/constants';
import { EntityStatus, errorImage, isNotEmptyObject } from '@clmovies/shareds/utils/functions';
import { IonContent } from '@ionic/angular';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TvPageState } from '../models';

@Component({
  selector: 'app-tv.page',
  template: `
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

    <div class="empty-header components-color">
      <div class="empty-div-50"></div>
      <h1 class="text-colorr">{{ tvName }}</h1>
      <div class="displays-center width-max heigth-50">
      </div>
    </div>

    <div class="container components-color">
      <ng-container *ngIf="(tv$ | async) as tv;">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">

              <ng-container *ngIf="isNotEmptyObject(tv); else noData">

                <ion-card class="width-max fade-in-card" >
                  <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+tv?.poster_path" [alt]="tv?.poster_path" (error)="errorImage($event)"/>
                </ion-card>

                <ion-card class="width-max fade-in-card" >
                  <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+tv?.backdrop_path" [alt]="tv?.poster_path" (error)="errorImage($event)"/>
                </ion-card>

                <div class="div-center margin-top-20 margin-bottom-10">
                  <h2 class="text-color-light margin-left-5">{{ 'COMMON.INFORMATION' | translate }}</h2>
                </div>

                <app-tv-info
                  [tv]="tv">
                </app-tv-info>
              </ng-container>

            </ng-container>
          </ng-container>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="(infoActors$ | async) as infoActors">
        <app-carrusel
          [title]="'COMMON.ACTORS'"
          [from]="FROM.MOVIE_ACTOR"
          [hash]="'/actor-list/tv/' + tvId"
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
  styleUrls: ['./tv.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TvPage {

  FROM = FROM;
  isNotEmptyObject = isNotEmptyObject;
  errorImage = errorImage;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  showButton = false;
  tvId: string;
  tvName: string

  status$ = this.route.params.pipe(
    switchMap(({idTv}) =>
      this.store.select(fromTv.selectSingleStatus(idTv)).pipe(
        map(status => (status || EntityStatus.Pending))
      )
    )
  );

  trigger = new EventEmitter<TvPageState>();
  componentStatus: TvPageState;
  tv$ = this.trigger.pipe(
    concatLatestFrom(() => this.store.select(fromTv.selectSingleSerie)),
    tap(([{idTv, reload}, storeTv]) => {
      if(!storeTv?.[idTv] || reload){
        this.store.dispatch(TvActions.loadTvSerie({idSerie: idTv}))
      }
    }),
    switchMap(([{idTv}]) =>
      this.store.select(fromTv.selectSingleList(idTv)).pipe(
        tap((tv) => this.tvName = tv?.name)
      )
    )
  );

  statusActor$ = this.route.params.pipe(
    switchMap(({idTv}) =>
      this.store.select(fromActor.selectTvActorStatusById(idTv)).pipe(
        map(status => (status || EntityStatus.Pending))
      )
    )
  );

  actorTrigger = new EventEmitter<TvPageState>();
  actorStatus: TvPageState;
  infoActors$ = this.actorTrigger.pipe(
    concatLatestFrom(() => this.store.select(fromActor.selectTvActorsList)),
    tap(([{idTv:id, reload}, actorStore]) => {
      if(!actorStore?.[id] || reload){
        this.store.dispatch(ActorActions.loadActorsTv({id: Number(id)}))
      }
    }),
    switchMap(([{idTv}]) =>
      this.store.select(fromActor.selectTvActorActorsById(idTv)).pipe(
        concatLatestFrom(() => this.store.select(fromActor.selectTvActorCrewsById(idTv))),
        map(([actors = [], crews = []]) => ({actors, crews}))
      )
    )
  );


  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) { }


  ionViewWillEnter(): void{
    this.tvId = this.route.snapshot.params?.idTv || null;
    this.componentStatus = { idTv: this.tvId, reload: false };
    this.actorStatus = { idTv: this.tvId, reload: false };
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
