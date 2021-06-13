import { Component, ChangeDetectionStrategy, EventEmitter, ViewChild } from '@angular/core';
import { fronMovie, Menu, Movie, MovieActions } from '@clmovies/shareds/movie';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { trackById, errorImage, emptyObject } from '@clmovies/shareds/shared/utils/utils';
import { IonInfiniteScroll } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-genrer',
  template:`
    <ion-content [fullscreen]="true">
      <div class="container components-color">

        <!-- HEADER  -->
        <div class="header" no-border>
          <ng-container *ngIf="genre$ | async as genre">
            <ng-container *ngIf="emptyObject(genre); else noTitle">
              <h1 class="text-second-color">{{genre?.name}}</h1>
            </ng-container>
          </ng-container>
          <ng-template #noTitle>
            <h1 class="text-second-color"> - </h1>
          </ng-template>
        </div>

        <ng-container *ngIf="(movies$ | async) as movies; else loader">
          <ng-container *ngIf="!(pending$ | async); else loader">
            <ng-container *ngIf="movies?.length > 0; else noData">
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
                  <ion-infinite-scroll-content loadingSpinner="crescent" color="primary">
                  </ion-infinite-scroll-content>
                </ion-infinite-scroll>
              </ng-container>

            </ng-container>
          </ng-container>
        </ng-container>

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
          <ion-spinner color="primary"></ion-spinner>
        </ng-template>

      </div>
    </ion-content >
  `,
  styleUrls: ['./genrer.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenrerPage {

  trackById = trackById;
  errorImage = errorImage;
  emptyObject = emptyObject;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  perPage = 1;
  reload$ = new EventEmitter();
  infiniteScroll$ = new EventEmitter();
  total$: Observable<number> = this.store.pipe(select(fronMovie.getTotalPages))
  pending$: Observable<boolean> = this.store.pipe(select(fronMovie.getPending))

  genre$: Observable<Menu> = this.route.params.pipe(
    switchMap(({idGenre}) =>
      this.store.pipe(select(fronMovie.getMenuGenre(idGenre)))
    )
  );

  movies$: Observable<Movie[]> = combineLatest([
    this.reload$.pipe(startWith('')),
    this.infiniteScroll$.pipe(startWith(1)),
    this.route.params
  ]).pipe(
    tap(([,page, {idGenre}]) => {
      this.store.dispatch(MovieActions.deleteMovieGenre()) //cuando entre, borramos los datos anteriores
      this.store.dispatch(MovieActions.loadMoviesGenre({page: page.toString(), idGenre})) //cargamos los datos
    }),
    switchMap(() => this.store.pipe(select(fronMovie.getMoviesGenre)))
  );


  constructor(private store: Store, private route: ActivatedRoute) {
    // this.movies$.subscribe(data => console.log(data))
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
