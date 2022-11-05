import { map, switchMap } from 'rxjs/operators';
import { concatLatestFrom } from '@ngrx/effects';
import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActorListComponentState } from '../models';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActorActions, fromActor } from '@clmovies/shareds/actor';
import { Actor } from '@clmovies/shareds/actor/model';
import { EntityStatus, gotToTop } from '@clmovies/shareds/utils/functions';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-actor-list',
  template: `
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

    <div class="empty-header components-color">
      <div class="empty-div-50"></div>
      <h1 class="text-colorr">{{'COMMON.ACTORS' | translate }}</h1>
      <div class="displays-center width-max heigth-50">
      </div>
    </div>

    <div class="container components-color">

      <ng-container *ngIf="(info$ | async) as info">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">
              <ng-container *ngIf="info?.actors.length > 0; else noData">

                <app-actor-card
                  *ngFor="let actor of info?.actors"
                  [item]="actor">
                </app-actor-card>

                <app-infinite-scroll
                  [slice]="info?.actors?.length"
                  [status]="status"
                  [total]="info?.total"
                  (loadDataTrigger)="loadData($event)">
                </app-infinite-scroll>

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
        <app-no-data [title]="'COMMON.ERROR'" [image]="'assets/images/error.png'" [top]="'5vh'"></app-no-data>
      </ng-template>

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'0vh'"></app-no-data>
      </ng-template>

      <!-- LOADER  -->
      <ng-template #loader>
        <app-spinner [top]="'30%'"></app-spinner>
      </ng-template>
    </div>

    <!-- TO TOP BUTTON  -->
    <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button class="back-color" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
    </ion-fab>
  </ion-content >
  `,
  styleUrls: ['./actor-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActorListPage {

  gotToTop = gotToTop;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  showButton = false;
  slice = 12;
  trigger = new EventEmitter<ActorListComponentState>();
  componentStatus: ActorListComponentState;
  status$ = this.route.params.pipe(
    switchMap(({type, id}) =>
      this.getStoreStatus(type, id)
    )
  );

  info$ = this.trigger.pipe(
    concatLatestFrom(({type}) => this.getStore(type)),
    tap(([{type, id, reload}, store]) => {
      if(!store?.[id] || !!reload){
        this.dispatchActorActions(type, Number(id || ''))
      }
    }),
    switchMap(([{type, id, slice}]) =>
      this.getStoreActors(type, id).pipe(
        map((actors) => {
          return {
            actors: (actors || [])?.slice(0, slice),
            total: actors?.length
          }
        })
      )
    )
    ,tap(d => console.log(d))
  );


  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) { }


  ionViewWillEnter(): void{
    const { type = null, id = null} = this.route.snapshot.params || {};
    this.componentStatus = { id, type, slice: this.slice, reload: false };
    this.trigger.next(this.componentStatus);
  }

  getStore(type: string): Observable<any>{
    return {
      'tv': this.store.select(fromActor.selectTvActorsList),
      'movie': this.store.select(fromActor.selectMovieActorsList)
    }?.[type] || this.store.select(fromActor.selectMovieActorsList)
  }

  dispatchActorActions(type: string, id: number): void {
    if(type === 'tv') {
      this.store.dispatch(ActorActions.loadActorsTv({id}))
      return;
    }
    if(type === 'movie') {
      this.store.dispatch(ActorActions.loadActorsMovie({id}))
      return;
    }
    this.store.dispatch(ActorActions.loadActorsMovie({id}))
  }

  getStoreActors(type: string, id: string): Observable<Actor[]> {
    return {
      'tv': this.store.select(fromActor.selectTvActorActorsById(id)),
      'movie': this.store.select(fromActor.selectMovieActorActorsById(id))
    }?.[type] || this.store.select(fromActor.selectMovieActorActorsById(id))
  }

  getStoreStatus(type: string, id: string): Observable<EntityStatus> {
    return {
      'tv': this.store.select(fromActor.selectTvActorStatusById(id)),
      'movie': this.store.select(fromActor.selectMovieActorStatusById(id))
    }?.[type] || this.store.select(fromActor.selectMovieActorStatusById(id))
  }

  // INIFINITE SCROLL
  loadData({event, total}) {
    setTimeout(() => {
      this.componentStatus = {
        ...this.componentStatus,
        slice: this.componentStatus?.slice + this.slice,
        reload: false
      };
      this.trigger.next(this.componentStatus);
      event.target.complete();
    }, 500);
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.componentStatus = {
        ...this.componentStatus,
        slice: this.slice,
        reload: true
      };
      this.trigger.next(this.componentStatus);

      event.target.complete();
    }, 500);
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }


}
