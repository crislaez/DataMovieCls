import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Movie, MovieService } from '@clmovies/shareds/movie';
import { Tv, TvService } from '@clmovies/shareds/tv';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { catchError, filter, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-search',
  template: `
    <ion-content [fullscreen]="true">
      <div class="container components-color">

        <!-- HEADER  -->
        <div class="header" no-border>
          <ng-container *ngIf="showMovie === 'movie' ; else tvs">
            <h1 class="text-second-color">Movies</h1>
          </ng-container>
          <ng-template #tvs>
            <h1 class="text-second-color">Tv</h1>
          </ng-template>

          <ion-segment (ionChange)="segmentChanged($event)" value="movie">
            <ion-segment-button value="movie">
              <ion-label>Movie</ion-label>
            </ion-segment-button>
            <ion-segment-button value="tv">
              <ion-label>Tv</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <ng-container *ngIf="showMovie === 'movie' ; else showTv">
          <form class="form" (submit)="searchSubmit($event)">
            <ion-searchbar color="light" placeholder="Buscar..." [formControl]="search"></ion-searchbar>
          </form>

          <app-search-result class="div-result"
            [serachResults]="(movies$ | async)"
            [showInfo]="showInfo['movie']"
            [pending]="pending"
            [route]="'movie'">
          </app-search-result>
        </ng-container>

        <ng-template #showTv>
          <form class="form" (submit)="searchTvSubmit($event)">
            <ion-searchbar color="light" placeholder="Buscar..." [formControl]="searchTv"></ion-searchbar>
          </form>

          <app-search-result class="div-result"
          [serachResults]="(tvs$ | async)"
          [showInfo]="showInfo['tv']"
          [pending]="pending"
          [route]="'tv'">
          </app-search-result>
        </ng-template>

         <!-- REFRESH -->
        <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>

      </div>
    </ion-content >
  `,
  styleUrls: ['./search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPage  {

  @ViewChild(IonContent, {static: true}) content: IonContent;
  search = new FormControl('');
  searchTv = new FormControl('');
  searchMovieValue$ = new EventEmitter()
  searchTvValue$ = new EventEmitter()
  reload$ = new EventEmitter();
  typeSearch$ = new EventEmitter()
  pending = false;
  showInfo:{[key:string]:boolean} = {
    movie: false,
    tv: false
  }
  showMovie = 'movie'

  movies$: Observable<Movie[]> = this.searchMovieValue$.pipe(
    startWith(''),
    filter( (search) => !!search),
    tap(() => this.pending = true),
    switchMap( (search) =>
      this._movie.getMoviesSearch(search).pipe(
        map(({movies}) => movies),
        catchError(() => [[]] ),
        finalize(() => this.pending = false)
      )
    )
  );

  tvs$: Observable<Tv[]> = this.searchTvValue$.pipe(
    startWith(''),
    filter((search) => !!search),
    tap(() => this.pending = true),
    switchMap( (search) =>
      this._tv.getTvearch(search).pipe(
        map(({tvs}) => tvs),
        catchError(() => [[]]),
        finalize(() => this.pending = false)
      )
    )
  )


  constructor( private _movie: MovieService, private _tv: TvService, public platform: Platform) {
    // this.tvs$.subscribe(data => console.log(data))
  }


  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.searchMovieValue$.next(this.search.value);
    this.showInfo['movie'] = true;
  }

  searchTvSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.searchTvValue$.next(this.searchTv.value);
    this.showInfo['tv'] = true;
  }

  doRefresh(event) {
    setTimeout(() => {
      this.search.reset();
      this.searchTv.reset();
      this.showInfo['movie'] = false;
      this.showInfo['tv'] = false;
      this.searchMovieValue$.next('');
      this.searchTvValue$.next('');
      event.target.complete();
    }, 500);
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  segmentChanged(event): void{
    this.scrollToTop()
    this.showMovie = event?.detail?.value
    this.typeSearch$.next(event?.detail?.value)
  }


}
