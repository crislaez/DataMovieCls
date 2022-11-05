import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { fromTv, TvActions } from '@clmovies/shareds/tv';
import { EntityStatus, gotToTop, parseTitle, trackById } from '@clmovies/shareds/utils/functions';
import { Menu } from '@clmovies/shareds/utils/models';
import { IonContent, ModalController, Platform } from '@ionic/angular';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FilterModalComponent } from 'src/app/shared-ui/filter-modal/filter-modal.component';
import { TvListPageState } from '../model';


@Component({
  selector: 'app-tv-list',
  template: `
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

    <div class="empty-header components-color">
      <div class="empty-div-50"></div>
      <h1 class="text-colorr">{{'COMMON.MOVIES' | translate }} {{ parseTitle(this.typeTv) }}</h1>
      <div class="displays-center width-max heigth-80">
        <ng-container *ngIf="(status$ | async) !== 'pending'">
            <!-- FORM  -->
            <form (submit)="searchSubmit($event)">
              <ion-searchbar
                (ionClear)="clearSearch($event)"
                [placeholder]="'COMMON.SEARCH' | translate"
                [formControl]="search">
              </ion-searchbar>
            </form>

            <!-- FILTER  -->
            <ion-button
              *ngIf="(menu$ | async) as menu"
              (click)="presentModal(menu)"
              class="displays-center class-ion-button" >
              <ion-icon name="options-outline"></ion-icon>
            </ion-button>
          </ng-container>
      </div>
    </div>

    <div class="container components-color">
      <ng-container *ngIf="(info$ | async) as info">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending' || componentStatus?.page > 1; else loader">
            <ng-container *ngIf="status !== 'error'; else serverError">
              <ng-container *ngIf="info?.list?.length > 0; else noData">

                <app-item-card
                  *ngFor="let tv of info?.list; trackBy: trackById"
                  [item]="tv"
                  [from]="'tv'">
                </app-item-card>

                <app-infinite-scroll
                  [slice]="info?.list?.length"
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
        <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'25vh'"></app-no-data>
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
  styleUrls: ['./tv-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TvListPage {

  gotToTop = gotToTop;
  trackById = trackById;
  parseTitle = parseTitle;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  showButton = false;
  typeTv: string;
  search = new FormControl(null)

  menu$ = this.store.select(fromTv.selectMenu);
  status$ = this.route.params.pipe(
    switchMap(({typeTv}) =>
      this.store.select(fromTv.selectListStatus(typeTv)).pipe(
        map((status) => status || EntityStatus.Pending)
      )
    ),
  );

  trigger = new EventEmitter<TvListPageState>();
  componentStatus: TvListPageState;
  info$ = this.trigger.pipe(
    concatLatestFrom(() => this.store.select(fromTv.selectListTvs)),
    // tap(d => console.log(d)),
    tap(([{typeTv, page, filter, reload}, storeData]) => {
      if(!reload){
        const { filter:storeFilter = null } = storeData?.[typeTv] || {};
        const { genre = null, search = null } = storeFilter || {};
        this.componentStatus = {
          ...this.componentStatus,
          filter:{
            ...(genre ? {genre} : {}),
            ...(search ? {search} : {}),
          },
        };
      }

      if((!storeData?.[typeTv]?.list || storeData?.[typeTv]?.list?.length === 0) || page > 1 || !!reload){
        this.store.dispatch(TvActions.loadTvs({typeTv, page, filter}))
      }

    }),
    switchMap(([{typeTv}]) =>
      this.store.select(fromTv.selectListList(typeTv)).pipe(
        concatLatestFrom(() => [
          this.store.select(fromTv.selectListPage(typeTv)),
          this.store.select(fromTv.selectListTotal(typeTv))
        ]),
        map(([list = [], page = 1, total = 0]) => ({list, page, total}))
      )
    )
  );


  constructor(
    private store: Store,
    public platform: Platform,
    private route: ActivatedRoute,
    public modalController: ModalController,
  ) { }


  ionViewWillEnter(): void{
    this.search.reset();
    this.typeTv = this.route.snapshot.params?.typeTv || 'popular';
    this.componentStatus = {
      typeTv: this.typeTv,
      page:1,
      filter:{},
      reload: false
    };
    this.trigger.next(this.componentStatus);
  }

  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.componentStatus = {
      ...this.componentStatus,
      filter:{
        // ...this.componentStatus?.filter,
        search: this.search.value,
      },
      page: 1,
      reload: true
    };
    this.trigger.next(this.componentStatus);
  }

  // DELETE SEARCH
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.componentStatus = {
      ...this.componentStatus,
      filter:{
        // ...this.componentStatus?.filter,
        search: null,
      },
      page: 1,
      reload: true
    };
    this.trigger.next(this.componentStatus);
  }

  // INIFINITE SCROLL
  loadData({event, total}, storagePage: number) {
    this.componentStatus = {
      ...this.componentStatus,
      page: storagePage + 1,
      reload: false
    };
    this.trigger.next(this.componentStatus);
    event.target.complete();
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.componentStatus = {
        ...this.componentStatus,
        filter:{},
        page: 1,
        reload: true
      };
      this.trigger.next(this.componentStatus);
      event.target.complete();
    }, 500);
  }

  // OPEN FILTER MODAL
  async presentModal(genres: Menu[]) {
    const { genre:inputFilter = null } = this.componentStatus?.filter || {};

    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        inputFilter,
        genres,
      },
      breakpoints: [0, 0.2, 0.5, 1],
      initialBreakpoint: 0.2,
    });

    modal.present();

    const { data = null } = await modal.onDidDismiss();
    if(!data || Object.keys(data || {})?.length === 0) return;

    this.componentStatus = {
      ...this.componentStatus,
      ...data,
      filter:{
        // ...this.componentStatus?.filter,
        ...(data ? data : {})
      },
      page: 1,
      reload: true
    };

    this.trigger.next(this.componentStatus)
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }


}
