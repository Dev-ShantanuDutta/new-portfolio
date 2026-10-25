export default `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Shantanu Dutta — .NET Full Stack Developer</title>
    <meta name="description" content=".NET full stack developer with 4+ years building enterprise web apps in C#, ASP.NET Core, Angular and React. Cut API response times by 40% with SQL Server tuning and Redis caching."/>
    <base href="/"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="icon" type="image/x-icon" href="favicon.ico"/>
    <script>
      // Theme bootstrap: apply the visitor's saved theme before first paint, on every
      // page (including tabs opened from "Try it"), so it never flashes the default.
      try {
        var savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          document.documentElement.setAttribute('data-theme', savedTheme);
        }
      } catch (e) {}
    </script>
    <script>
      // Motion bootstrap. Runs before first paint, so animated content never flashes.
      // - \`motion\` turns on the hidden-until-revealed states. Only added when the
      //   browser can run the reveals (feature detection, no browser sniffing).
      // - Failsafe: if the app hasn't marked itself live within 4s (script error,
      //   very slow network), drop \`motion\` so every element is shown as normal.
      // - \`intro-playing\`: first visit this session, on the home page, no
      //   reduced-motion preference and no deep link to a section. Add \`?intro\` to the
      //   URL to replay it on demand (still skipped for reduced motion).
      (function () {
        var root = document.documentElement;
        if (!('IntersectionObserver' in window) || !('classList' in root)) return;

        root.classList.add('motion');
        setTimeout(function () {
          if (!root.classList.contains('motion-live')) {
            root.classList.remove('motion', 'intro-playing');
          }
        }, 4000);

        var reduce =
          window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var seen = '1';
        try {
          seen = sessionStorage.getItem('intro-seen');
          sessionStorage.setItem('intro-seen', '1');
        } catch (e) {}

        var replay = /[?&]intro(=|&|\$)/.test(location.search);
        var firstVisit = !seen && location.pathname === '/' && !location.hash;

        if (!reduce && (firstVisit || replay)) {
          root.classList.add('intro-playing');
        }
      })();
    </script>
    <style>
      .intro {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: grid;
        place-items: center;
        background: var(--color-bg-page, #f9fafb);
        color: var(--color-text-primary, #111827);
        font-family: var(--font-mono, ui-monospace, monospace);
        /* Failsafe: hidden after 7s by CSS alone, even if the script below breaks. */
        animation: intro-failsafe 0s 7s forwards;
        transition:
          opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
          translate 700ms cubic-bezier(0.16, 1, 0.3, 1);
      }
      .intro--leaving {
        opacity: 0;
        translate: 0 -24px;
        pointer-events: none;
      }
      .intro__content {
        animation: intro-content-in 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      .intro__line {
        margin: 0;
        /* Heading-sized; 7vw keeps "> shantanu dutta" on one line on phones. */
        font-size: clamp(1.75rem, 7vw, 4.5rem);
        font-weight: 600;
        line-height: 1.1;
        white-space: nowrap;
        /* Full width of "> shantanu dutta" + caret, reserved up front so the line
           stays put while it types instead of re-centring on every letter. */
        width: 17ch;
      }
      .intro__prompt {
        color: var(--color-accent, #df522c);
      }
      .intro__caret {
        display: inline-block;
        width: 0.6ch;
        height: 1.1em;
        margin-left: 2px;
        vertical-align: text-bottom;
        background: var(--gradient-accent, linear-gradient(135deg, #f56a47, #f97a1f));
        animation: intro-caret 1s steps(1) infinite;
      }
      .intro__role {
        margin: 1.25rem 0 0;
        font-size: clamp(1rem, 2.4vw, 1.5rem);
        color: var(--color-text-secondary, #4b5563);
        opacity: 0;
        translate: 0 12px;
        transition:
          opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
          translate 700ms cubic-bezier(0.16, 1, 0.3, 1);
      }
      .intro__role--in {
        opacity: 1;
        translate: none;
      }
      .intro__hint {
        position: absolute;
        bottom: 1.5rem;
        left: 0;
        right: 0;
        margin: 0;
        text-align: center;
        font-size: 0.875rem;
        color: var(--color-text-secondary, #4b5563);
      }
      @keyframes intro-content-in {
        from {
          opacity: 0;
          translate: 0 16px;
        }
      }
      @keyframes intro-failsafe {
        to {
          visibility: hidden;
        }
      }
      @keyframes intro-caret {
        50% {
          opacity: 0;
        }
      }
    </style>
  <link rel="stylesheet" href="styles-UTRRIN43.css"></head>
  <body><script type="text/javascript" id="ng-event-dispatch-contract">(()=>{function p(t,n,r,o,e,i,f,m){return{eventType:t,event:n,targetElement:r,eic:o,timeStamp:e,eia:i,eirp:f,eiack:m}}function u(t){let n=[],r=e=>{n.push(e)};return{c:t,q:n,et:[],etc:[],d:r,h:e=>{r(p(e.type,e,e.target,t,Date.now()))}}}function s(t,n,r){for(let o=0;o<n.length;o++){let e=n[o];(r?t.etc:t.et).push(e),t.c.addEventListener(e,t.h,r)}}function c(t,n,r,o,e=window){let i=u(t);e._ejsas||(e._ejsas={}),e._ejsas[n]=i,s(i,r),s(i,o,!0)}window.__jsaction_bootstrap=c;})();
</script>
    <script>
      // Branded intro (~5s, skippable with any key, click, tap or scroll). Built
      // here rather than in Angular so it covers the page from the very first paint
      // and is never part of the server-rendered HTML.
      (function () {
        var root = document.documentElement;
        if (!root.classList.contains('intro-playing')) return;

        var NAME = 'Shantanu Dutta';
        // Timeline (ms): type the name, bring in the role, hold, then a 700ms exit.
        var TYPE_START = 500;
        var TYPE_STEP = 90;
        var ROLE_AT = 2000;
        var LEAVE_AT = 4300;
        var EXIT_MS = 700;
        var intro = document.createElement('div');
        intro.className = 'intro';
        intro.setAttribute('aria-hidden', 'true');
        intro.innerHTML =
          '<div class="intro__content">' +
          '<p class="intro__line"><span class="intro__prompt">&gt;</span> ' +
          '<span class="intro__typed"></span><span class="intro__caret"></span></p>' +
          '<p class="intro__role">.NET Full-Stack developer</p>' +
          '</div>' +
          '<p class="intro__hint">Press any key to skip</p>';
        document.body.appendChild(intro);

        var typed = intro.querySelector('.intro__typed');
        var role = intro.querySelector('.intro__role');
        var timers = [];
        var done = false;

        function later(fn, ms) {
          timers.push(setTimeout(fn, ms));
        }

        for (var i = 1; i <= NAME.length; i++) {
          (function (n) {
            later(
              function () {
                typed.textContent = NAME.slice(0, n);
              },
              TYPE_START + n * TYPE_STEP,
            );
          })(i);
        }
        later(function () {
          role.classList.add('intro__role--in');
        }, ROLE_AT);
        later(finish, LEAVE_AT);

        function finish() {
          if (done) return;
          done = true;
          timers.forEach(clearTimeout);
          typed.textContent = NAME;
          intro.classList.add('intro--leaving');
          root.classList.remove('intro-playing');
          window.dispatchEvent(new Event('intro:done'));
          ['keydown', 'pointerdown', 'wheel', 'touchstart'].forEach(function (type) {
            window.removeEventListener(type, finish, true);
          });
          setTimeout(function () {
            intro.remove();
          }, EXIT_MS + 50);
        }

        ['keydown', 'pointerdown', 'wheel', 'touchstart'].forEach(function (type) {
          window.addEventListener(type, finish, { capture: true, passive: true });
        });
      })();
    </script>
    <app-root></app-root>
  <script src="main-IPO5S4QM.js" type="module"></script></body>
</html>
`;