import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('defaults to null before the response arrives', () => {
    expect(service.profile()).toBeNull();

    httpMock.expectOne('https://api.github.com/users/Shantanu-Dutta-2001').flush({
      login: 'octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/1',
      html_url: 'https://github.com/octocat',
      public_repos: 8,
      followers: 18,
    });
  });

  it('normalizes the GitHub REST response into a camelCase profile', () => {
    const req = httpMock.expectOne('https://api.github.com/users/Shantanu-Dutta-2001');
    expect(req.request.method).toBe('GET');

    req.flush({
      login: 'octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/1',
      html_url: 'https://github.com/octocat',
      public_repos: 8,
      followers: 18,
    });

    expect(service.profile()).toEqual({
      username: 'octocat',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1',
      profileUrl: 'https://github.com/octocat',
      publicRepos: 8,
      followers: 18,
    });
  });
});
