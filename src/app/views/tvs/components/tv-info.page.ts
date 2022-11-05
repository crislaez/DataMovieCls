import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { getMovieArrayData, trackById } from '@clmovies/shareds/utils/functions';
import { Tv } from '@clmovies/shareds/utils/models';

@Component({
  selector: 'app-tv-info',
  template: `
  <ion-card class="width-max text-color">
    <ion-card-content>
      <div *ngFor="let item of infoTv; trackBy: trackById"
        class="displays-between width-max mediun-size margin-bottom-20">
        <div
          [ngClass]="{'width-max': ['overview']?.includes(item?.field), 'width-47': !['overview']?.includes(item?.field) }"
          class="span-bold">
          {{ item?.label | translate }}:
        </div>

        <div  *ngIf="['genres', 'production_companies']?.includes(item?.field)" class="width-47">
          {{ getMovieArrayData(tv?.[item?.field]) }}
        </div>
        <div *ngIf="['homepage']?.includes(item?.field) && tv?.[item?.field]" class="width-47" >
          <a [href]="tv?.[item?.field]">{{'COMMON.HERE' | translate }}</a>
        </div>
        <div *ngIf="['first_air_date']?.includes(item?.field)" class="width-47">
          {{ tv?.[item?.field] | date: 'MMM d, y' }}
        </div>
        <div *ngIf="!['genres', 'production_companies', 'first_air_date', 'homepage', 'overview']?.includes(item?.field)" class="width-47">
          {{ tv?.[item?.field] }}
        </div>

        <div *ngIf="['overview']?.includes(item?.field)"
          [ngClass]="{'width-max': ['overview']?.includes(item?.field), 'width-47': !['overview']?.includes(item?.field) }"
          class="margin-top-10">
          {{ sliceText(tv?.[item?.field]) }}
          <ion-button class="class-ion-button"
            (click)="showMore = !showMore">
            {{ (!showMore ? 'COMMON.SHEE_MORE' : 'COMMON.SHEE_LESS') | translate }}
          </ion-button>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
  `,
  styleUrls: ['./tv-info.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TvInfoComponent {

  trackById = trackById;
  getMovieArrayData = getMovieArrayData;
  @Input() tv: Tv;
  showMore = false;
  infoTv = [
    {id:1, label: 'COMMON.GENRES', field: 'genres'},
    {id:2, label: 'COMMON.PRODUCT_COMPANY', field: 'production_companies'},
    {id:3, label: 'COMMON.NOTE', field: 'vote_average'},
    {id:4, label: 'COMMON.DATE', field: 'first_air_date'},
    {id:5, label: 'COMMON.SHOW_IN_WEB', field: 'homepage'},
    {id:6, label: 'COMMON.DESCRIPTION', field: 'overview'}
  ];


  constructor() { }


  sliceText(text: string): string{
    return !this.showMore ? text?.slice(0, 30) + '...' : text
  }

}
