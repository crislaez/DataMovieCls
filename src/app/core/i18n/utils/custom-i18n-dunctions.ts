// import { HttpClient, HttpParams } from '@angular/common/http';
// import {TranslateHttpLoader} from '@ngx-translate/http-loader';
// import { TranslateLoader, TranslateService } from '@ngx-translate/core';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { Environment } from '../../models/token';

// // export class CustomI18nLoader implements TranslateLoader {
// //   constructor(private http: HttpClient, private env: Environment) { }

// //   getTranslation(lang: string): Observable<any> {
// //     let request: Observable<any> = throwError('Invalid locale');
// //     switch (lang) {
// //       case 'es':
// //         request = this.http.get(this.env.lang);
// //         break;
// //       case 'en':
// //         const params = new HttpParams()
// //           .append('lang', lang);
// //         request = this.http.get(this.env.lang, { params });
// //         break;
// //       default:
// //         console.error('Invalid locale');
// //     }
// //     return request.pipe(
// //       catchError(() => [{}])
// //     );
// //   }
// // }

// export function createTranslateLoader(http: HttpClient) {
//   return new TranslateHttpLoader(http, '../../../assets/i18n/', '.json');
// }


// export function appInitTranslations(translate: TranslateService, languages: string[], defaultLang: string): Promise<any> {

//   const borwserLang = translate.getBrowserLang();
//   const storeLang = localStorage.getItem('Language')
//   const currentDefaultLnag = storeLang || (languages.includes(borwserLang) && borwserLang) || defaultLang

//   return new Promise<void>(resolve => {
//     translate.addLangs(languages)
//     localStorage.setItem('Language', currentDefaultLnag)
//     translate.setDefaultLang(currentDefaultLnag);
//     translate.use(currentDefaultLnag).subscribe(() => resolve());
//   });
// }
