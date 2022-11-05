import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fromMovie, MovieActions } from '@clmovies/shareds/movie';
import { Menu } from '@clmovies/shareds/utils/models';
import { errorImage, gotToTop, trackById } from '@clmovies/shareds/utils/functions';
import { IonContent, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { FilterModalComponent } from 'src/app/shared-ui/filter-modal/filter-modal.component';
import { VideoPageState } from './../model/index';


@Component({
  selector: 'app-home',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <div class="empty-header components-color">
        <div class="empty-div-50"></div>

        <h1 class="text-colorr">{{'COMMON.MOVIES' | translate }}</h1>

        <div class="displays-center width-max heigth-80">
          <ng-container *ngIf="(status$ | async) !== 'pending'">
            <!-- FORM  -->
            <!-- (submit)="searchSubmit($event)"  -->
            <!-- (ionClear)="clearSearch($event)" -->
            <form >
              <ion-searchbar [placeholder]="'COMMON.SEARCH' | translate" [formControl]="search"></ion-searchbar>
            </form>

            <!-- FILTER  -->
            <!-- -->
            <!--  -->
            <ion-button
              *ngIf="(menu$ | async) as menu"
              (click)="presentModal(menu)"
              class="displays-center class-ion-button" >
              <ion-icon name="options-outline"></ion-icon>
            </ion-button>
          </ng-container>
        </div>

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

      <div class="container components-color">
        <ng-container *ngIf="(info$ | async) as info">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending' || statusComponent?.page !== 1; else loader">
              <ng-container *ngIf="status !== 'error'; else serverError">
                <ng-container *ngIf="info?.movies?.length > 0; else noData">

                  <app-item-card
                    *ngFor="let movie of info?.movies; trackBy: trackById"
                    [item]="movie"
                    [from]="'movie'">
                  </app-item-card>

                  <app-infinite-scroll
                    [slice]="info?.movies?.length"
                    [status]="status"
                    [total]="info?.total"
                    (loadDataTrigger)="loadData($event, info?.page)">
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
          <app-no-data [title]="'COMMON.ERROR'" [image]="'assets/images/error.png'" [top]="'30vh'"></app-no-data>
        </ng-template>

        <!-- IS NO DATA  -->
        <ng-template #noData>
          <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'30vh'"></app-no-data>
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
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage  {

  gotToTop = gotToTop;
  trackById = trackById;
  errorImage = errorImage;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  search = new FormControl(null)
  showButton = false;

  menu$ = this.store.select(fromMovie.selectMenu);
  trigger = new EventEmitter<VideoPageState>();
  statusComponent: VideoPageState = {
    page: 1,
    typeMovie: 'popular',
    genre: null,
    reload: false
  };

  status$ = this.trigger.pipe(
    startWith(this.statusComponent),
    switchMap(({typeMovie}) => this.store.select(fromMovie.selectListStatus(typeMovie)))
  );

  info$ = this.trigger.pipe(
    startWith(this.statusComponent),
    concatLatestFrom(() => this.store.select(fromMovie.selectListMovies)),
    tap(([{page, typeMovie, reload, genre}, movieStorage]) => {
      if(!movieStorage?.[typeMovie] || page > 1 || reload){
        const filter = {
          ...(genre ? {genre} : {})
        };
        this.store.dispatch(MovieActions.loadMovies({typeMovie, page, filter}))
      }
    }),
    switchMap(([{ typeMovie }]) =>
      this.store.select(fromMovie.selectListList(typeMovie)).pipe(
        concatLatestFrom(() => [
          this.store.select(fromMovie.selectListTotal(typeMovie)),
          this.store.select(fromMovie.selectListPage(typeMovie))
        ]),
        map(([movies = [], total = 0, page = 1]) => ({movies, total, page}))
      )
    )
  );


  constructor(
    private store: Store,
    public modalController: ModalController,
  ) { }


  segmentChanged(event): void{
    this.content.scrollToTop();
    this.statusComponent = {
      ...this.statusComponent,
      page: 1,
      typeMovie: event?.detail?.value,
      reload: false
    };
    this.trigger.next(this.statusComponent)
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.statusComponent = {
        ...this.statusComponent,
        page: 1,
        reload: true
      };
      this.trigger.next(this.statusComponent);
      event.target.complete();
    }, 500);
  }

  // INIFINITE SCROLL
  loadData({event, total}, storagePage: number) {
    setTimeout(() => {
      this.statusComponent = {
        ...this.statusComponent,
        page: storagePage + 1,
        reload: false
      };
      this.trigger.next(this.statusComponent);
      event.target.complete();
    }, 500);
  }

  // OPEN FILTER MODAL
  async presentModal(genres: Menu[]) {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        inputFilter: this.statusComponent?.genre,
        genres,
      }
    });

    modal.present();

    const { data = null } = await modal.onDidDismiss();
    if(!data || Object.keys(data || {})?.length === 0) return;

    this.statusComponent = {
      ...this.statusComponent,
      ...data,
      page: 1,
      reload: true
    };

    this.trigger.next(this.statusComponent)
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }



}
