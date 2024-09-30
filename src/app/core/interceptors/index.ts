

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './auth.interceptor';
import { ResponseInterceptor } from './response.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
];

// TODO:
// All intercepots https://stackblitz.com/github/melcor76/interceptors?file=src%2Fapp%2Finterceptors%2Findex.ts
