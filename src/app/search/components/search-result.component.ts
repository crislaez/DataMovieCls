import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { errorImage, trackById } from '@clmovies/shareds/shared/utils/utils';

@Component({
  selector: 'app-search-result',
  template:`
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

    <div class="div-container margin-top">
      <ng-container *ngIf="serachResults">
        <ng-container *ngIf="!pending; else loader">
          <ng-container *ngIf="!!showInfo">
            <ng-container *ngIf="serachResults?.length > 0; else noData">

              <ion-card class="ion-activatable ripple-parent fade-in-card" [routerLink]="['/'+route+'/'+serachResult?.id]" *ngFor="let serachResult of serachResults; trackBy: trackById" >
                <img loading="lazy" [src]="'https://image.tmdb.org/t/p/w500'+serachResult?.poster_path" [alt]="serachResult?.poster_path" (error)="errorImage($event)"/>
                <ion-card-header>
                  <ion-card-title class="text-color">{{serachResult?.original_title || serachResult?.name }}</ion-card-title>
                </ion-card-header>
                <ion-card-content class="text-color">
                  Points: {{serachResult?.vote_average}}
                </ion-card-content>
                <ion-ripple-effect></ion-ripple-effect>
              </ion-card>

            </ng-container>
          </ng-container>
        </ng-container>
      </ng-container>
    </div>
  `,
  styleUrls: ['./search-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultComponent {

  errorImage = errorImage;
  trackById = trackById;
  @Input() serachResults: any[]
  @Input() showInfo: boolean
  @Input() pending: boolean
  @Input() route: string;

  constructor() { }



}
