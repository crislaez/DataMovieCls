import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { errorImage, trackById } from '@clmovies/shareds/shared/utils/utils';
import { fromTv, Tv, TvActions } from '@clmovies/shareds/tv';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-tvs',
  template: `
  <ion-content [fullscreen]="true">
    <div class="container components-color">

      <div class="div-header-fixed header">
        <!-- HEADER  -->
        <div class="div-center" no-border>
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

      <div class="div-container">
        <ng-container *ngIf="(tvs$ | async) as tvs;">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending' || perPage > 1; else loader">
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
                    <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, total)">
                      <ion-infinite-scroll-content class="loadingspinner">
                      </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                  </ng-container>

                </ng-container>

              </ng-container>
            </ng-container>
          </ng-container>
        </ng-container>
      </div>


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
  </ion-content >
  `,
  styleUrls: ['./tvs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TvsPage {

  trackById = trackById;
  errorImage = errorImage;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent;

  perPage = 1;
  reload$ = new EventEmitter();
  infiniteScroll$ = new EventEmitter();
  typeMovie$ = new EventEmitter()
  total$ = this.store.pipe(select(fromTv.getTotalPages))
  status$ = this.store.pipe(select(fromTv.getStatus))

  tvs$: Observable<Tv[]> = combineLatest([
    this.reload$.pipe(startWith('')),
    this.typeMovie$.pipe(startWith('popular')),
    this.infiniteScroll$.pipe(startWith(1)),
  ]).pipe(
    tap(([, typeTv ,page]) =>  this.store.dispatch(TvActions.loadTvs({typeTv, page: page.toString()}))),
    switchMap(() => this.store.pipe(select(fromTv.getTvs)))
  );


  constructor(private store: Store) {
    // this.tvs$.subscribe(data => console.log(data))
   }


  scrollToTop() {
    this.content.scrollToTop();
  }

  segmentChanged(event): void{
    this.store.dispatch(TvActions.deleteTvs())
    this.scrollToTop()
    this.typeMovie$.next(event?.detail?.value)
    this.perPage = 1
    this.infiniteScroll$.next(1)
  }

  doRefresh(event) {
    setTimeout(() => {
      this.reload$.next('')
      event.target.complete();
    }, 500);
  }

  loadData(event, total) {
    setTimeout(() => {
      this.perPage = this.perPage + 1;
      if(this.perPage > total){
        this.ionInfiniteScroll.disabled = true
        return
      }
      this.infiniteScroll$.next(this.perPage)
      event.target.complete();
    }, 500);
  }



}
