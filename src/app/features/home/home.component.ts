import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SITE_OG_IMAGE, SITE_URL } from '../../core/constants/site.constants';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { AboutTasteComponent } from '../about-taste/about-taste.component';
import { ContactComponent } from '../contact/contact.component';
import { ExperienceComponent } from '../experience/experience.component';
import { HeroComponent } from '../hero/hero.component';
import { HowIEngineerComponent } from '../how-i-engineer/how-i-engineer.component';
import { ProofStripComponent } from '../proof-strip/proof-strip.component';
import { SelectedWorkComponent } from '../selected-work/selected-work.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    ProofStripComponent,
    HowIEngineerComponent,
    SelectedWorkComponent,
    ExperienceComponent,
    AboutTasteComponent,
    ContactComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      const identity = this.content.identity();

      if (!identity) {
        return;
      }

      const description = identity.specialization.map((segment) => segment.text).join('');

      this.seo.setMetadata({
        title: `${identity.name} — .NET Full Stack Developer`,
        description,
        url: SITE_URL,
        image: SITE_OG_IMAGE,
      });

      this.seo.setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: identity.name,
        description,
        url: SITE_URL,
        jobTitle: '.NET Full Stack Developer',
        sameAs: [identity.contact.github, identity.contact.linkedin].filter(Boolean),
      });
    });
  }
}
