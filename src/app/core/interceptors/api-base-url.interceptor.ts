import { HttpInterceptorFn } from '@angular/common/http';
import { REQUEST, inject } from '@angular/core';

const ABSOLUTE_URL = /^https?:\/\//;

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const incomingRequest = inject(REQUEST, { optional: true });

  if (!incomingRequest || ABSOLUTE_URL.test(req.url)) {
    return next(req);
  }

  return next(req.clone({ url: new URL(req.url, incomingRequest.url).toString() }));
};
