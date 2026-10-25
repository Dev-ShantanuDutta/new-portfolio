import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Injectable,
  InjectionToken,
  PLATFORM_ID,
  TransferState,
  computed,
  inject,
  makeStateKey,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, of, tap } from 'rxjs';

const GITHUB_USERNAME = 'Shantanu-Dutta-2001';

/**
 * GitHub token for authenticated (5000/hr) API requests. Provided only in
 * app.config.server.ts from the GITHUB_TOKEN env var, so it never ends up in
 * the browser bundle or in any request the browser makes.
 */
export const GITHUB_TOKEN = new InjectionToken<string | null>('GITHUB_TOKEN', {
  factory: () => null,
});

interface GithubUserResponse {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
}

export interface GithubProfile {
  username: string;
  avatarUrl: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
}

const PROFILE_KEY = makeStateKey<GithubUserResponse | null>('github-profile');

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly http = inject(HttpClient);
  private readonly transferState = inject(TransferState);
  private readonly token = inject(GITHUB_TOKEN);
  private readonly isServer = isPlatformServer(inject(PLATFORM_ID));

  private readonly rawProfile = toSignal(this.loadProfile(), { initialValue: null });

  /**
   * Public GitHub profile stats. `null` until the request resolves. Fetched
   * on the server (with the token) and handed to the browser via
   * TransferState, so the browser only hits GitHub if the server didn't.
   */
  readonly profile = computed<GithubProfile | null>(() => {
    const raw = this.rawProfile();

    if (!raw) {
      return null;
    }

    return {
      username: raw.login,
      avatarUrl: raw.avatar_url,
      profileUrl: raw.html_url,
      publicRepos: raw.public_repos,
      followers: raw.followers,
    };
  });

  private loadProfile(): Observable<GithubUserResponse | null> {
    if (!this.isServer) {
      const cached = this.transferState.get(PROFILE_KEY, null);
      if (cached) {
        return of(cached);
      }
    }

    const headers =
      this.isServer && this.token
        ? new HttpHeaders({ Authorization: `Bearer ${this.token}` })
        : undefined;

    return this.http
      .get<GithubUserResponse>(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers })
      .pipe(
        tap((raw) => {
          if (this.isServer) {
            this.transferState.set(PROFILE_KEY, raw);
          }
        }),
        // A rate-limited or offline GitHub just hides the stats; it shouldn't fail the page.
        catchError(() => of(null)),
      );
  }
}
