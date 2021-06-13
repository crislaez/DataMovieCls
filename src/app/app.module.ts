import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RootComponent } from './core';
import { ENVIRONMENT } from './core/externals';
import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// import { AuthService } from './core/modules/auth/services/auth.service';
// import { Store } from '@ngrx/store';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { HttpErrorInterceptor } from './core/services/http-error.interceptor';

// export function appInitializerFactory(translate: TranslateService, coreConfig: CoreConfigService): Function {
//   coreConfig.importConfig(appConfig);
//   return () => appInitTranslations(translate, appConfig.Languages, appConfig.DefaultLang);
// };

@NgModule({
  entryComponents: [],
  imports: [
    BrowserModule,
    CoreModule,
    IonicModule.forRoot(),
    StoreModule.forRoot({},
      {
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({maxAge:4}),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: appInitializerFactory,
    //   deps: [TranslateService, CoreConfigService],
    //   multi: true
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpErrorInterceptor,
    //   deps: [AuthService, Store],
    //   multi: true
    // },
    {
      provide: ENVIRONMENT,
      useValue: environment
    }
  ],
  bootstrap: [
    RootComponent
  ],
})
export class AppModule {}
