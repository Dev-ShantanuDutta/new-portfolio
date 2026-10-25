import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { GITHUB_TOKEN } from './core/services/github.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Server-only: read at build/render time from the environment, never shipped to the browser.
    { provide: GITHUB_TOKEN, useFactory: () => process.env['GITHUB_TOKEN'] || null },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
