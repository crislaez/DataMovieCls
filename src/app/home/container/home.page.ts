import { Component, ChangeDetectionStrategy, EventEmitter, ViewChild } from '@angular/core';
import { fronMovie, Movie, MovieActions } from '@clmovies/shareds/movie';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { trackById, errorImage } from '@clmovies/shareds/shared/utils/utils';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';


@Component({
  selector: 'app-home',
  template: `
    <ion-content [fullscreen]="true">
      <div class="container components-color">

        <div class="div-header-fixed header">
          <!-- HEADER  -->
          <div class="div-center" no-border>
            <h1 class="text-second-color">Movies</h1>
          </div>

          <!-- Disabled Segment -->
          <ion-segment (ionChange)="segmentChanged($event)" value="popular">
            <ion-segment-button value="popular">
              <ion-label>Popular</ion-label>
            </ion-segment-button>
            <ion-segment-button value="top_rated">
              <ion-label>Top rated</ion-label>
            </ion-segment-button>
            <ion-segment-button value="upcoming">
              <ion-label>Upcoming</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <div class="div-container">
          <ng-container *ngIf="(movies$ | async) as movies; else loader">
            <ng-container *ngIf="!(pending$ | async) || perPage > 1; else loader">
              <ng-container *ngIf="movies?.length > 0; else noData">
              <!-- [routerLink]="['/anew/'+aNew?.title]" [queryParams]="{ismovies:true}" -->
                <ion-card class="ion-activatable ripple-parent fade-in-card" [routerLink]="['/movie/'+movie?.id]" *ngFor="let movie of movies; trackBy: trackById" >
                  <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+movie?.poster_path" [alt]="movie?.poster_path" (error)="errorImage($event)"/>

                  <ion-card-header>
                    <ion-card-title class="text-color">{{movie?.original_title}}</ion-card-title>
                  </ion-card-header>
                  <ion-card-content class="text-color">
                    Points: {{movie?.vote_average}}
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
        </div>

         <!-- REFRESH -->
        <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>

        <!-- IS NO DATA  -->
        <ng-template #noData>
          <div class="error-serve">
            <span class="text-second-color">No data</span>
          </div>
        </ng-template>

        <!-- LOADER  -->
        <ng-template #loader>
          <ion-spinner class="loadingspinner"></ion-spinner>
        </ng-template>

      </div>
    </ion-content >
  `,
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage  {

  trackById = trackById;
  errorImage = errorImage;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent;

  perPage = 1;
  reload$ = new EventEmitter();
  infiniteScroll$ = new EventEmitter();
  typeMovie$ = new EventEmitter()
  total$: Observable<number> = this.store.pipe(select(fronMovie.getTotalPages))
  pending$: Observable<boolean> = this.store.pipe(select(fronMovie.getPending))

  movies$: Observable<Movie[]> = combineLatest([
    this.reload$.pipe(startWith('')),
    this.typeMovie$.pipe(startWith('popular')),
    this.infiniteScroll$.pipe(startWith(1)),
  ]).pipe(
    tap(([, typeMovie ,page]) =>  this.store.dispatch(MovieActions.loadMovies({typeMovie, page: page.toString()}))),
    switchMap(() => this.store.pipe(select(fronMovie.getMovies)))
  );


  constructor(private store: Store) {
    // this.movies$.subscribe(data => console.log(data))
   }

  scrollToTop() {
    this.content.scrollToTop();
  }

  segmentChanged(event): void{
    this.store.dispatch(MovieActions.deleteMovies())
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
