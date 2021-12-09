import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { fromMovie, Menu, MovieActions } from '@clmovies/shareds/movie';
import { fromTv } from '@clmovies/shareds/tv';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template:`
   <ion-app >
    <!-- CABECERA  -->
    <ion-header no-border >
      <ion-toolbar mode="md|ios">
        <ion-button fill="clear" size="small" slot="start"  (click)="open()">
          <ion-menu-button class="text-color"></ion-menu-button>
        </ion-button>
        <ion-title class="text-color" >{{'COMMON.TITLE' | translate }}</ion-title>
        <div size="small" slot="end">
        </div>
      </ion-toolbar>
    </ion-header>

    <!-- MENU LATERAL  -->
    <ion-menu side="start" menuId="first" contentId="main">
      <ion-header>
        <ion-toolbar >
          <ion-title class="text-color" >{{'COMMON.MENU' | translate }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content *ngIf="(menuMovie$ | async) as menuMovie">
        <ng-container *ngIf="menuMovie?.length > 0; else noMoviesList">
          <ion-item class="text-color" *ngFor="let item of menuMovie" [routerLink]="['/genre/'+item?.id]" [queryParams]="{'genre':'movie'}" (click)="deleteMovieByIdGenre()">{{item?.name}} Movie</ion-item>
        </ng-container>
        <ng-template #noMoviesList>
          <ion-item class="text-color">{{'COMMON.NORESULT' | translate }}</ion-item>
        </ng-template>
      </ion-content >

      <ion-content *ngIf="(menuTv$ | async) as menuTv">
        <ng-container *ngIf="menuTv?.length > 0; else noTvList">
          <ion-item class="text-color" *ngFor="let item of menuTv" [routerLink]="['/genre/'+item?.id]" [queryParams]="{'genre':'tv'}" (click)="deleteMovieByIdGenre()">{{item?.name}} Tv</ion-item>
        </ng-container>
        <ng-template #noTvList>
          <ion-item class="text-color">{{'COMMON.NORESULT' | translate }}</ion-item>
        </ng-template>
      </ion-content >
    </ion-menu>

    <!-- RUTER  -->
    <ion-router-outlet id="main"></ion-router-outlet>

    <!-- TAB FOOTER  -->
    <ion-tabs >
      <ion-tab-bar  [translucent]="true" slot="bottom">
        <ion-tab-button class="text-color" [routerLink]="['home']">
          <ion-icon name="videocam-outline"></ion-icon>
        </ion-tab-button>

        <ion-tab-button class="text-color" [routerLink]="['tv']">
          <ion-icon name="tv-outline"></ion-icon>
        </ion-tab-button>

        <ion-tab-button class="text-color" [routerLink]="['search']">
          <ion-icon name="search-outline"></ion-icon>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>

  </ion-app>
  `,
  styleUrls: ['./root.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent {

  menuMovie$: Observable<Menu[]> = this.store.select(fromMovie.getMenu);
  menuTv$: Observable<Menu[]> = this.store.select(fromTv.getMenu);


  constructor(
    private menu: MenuController,
    private router: Router,
    private store: Store
  ) { }


  open() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  redirectTo(passage: string): void{
    this.router.navigate(['/chapter/'+passage])
    this.menu.close('first')
  }

  openEnd() {
    this.menu.close();
  }

  deleteMovieByIdGenre(): void{
    // this.store.dispatch(MovieActions.deleteMovieGenre())
    this.openEnd();
  }


}
