import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { IconChipComponent } from '../../shared/ui/icon-chip/icon-chip.component';
import { PillButtonComponent } from '../../shared/ui/pill-button/pill-button.component';

interface ContactLink {
  label: string;
  icon: string;
  href: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [IconChipComponent, PillButtonComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly identity = inject(ContentService).identity;

  /** The four equal-weight contact channels, shared by the main section and the mobile bar. */
  protected readonly links = computed<ContactLink[]>(() => {
    const identity = this.identity();

    if (!identity) {
      return [];
    }

    return [
      { label: 'Email', icon: '📧', href: `mailto:${identity.contact.email}` },
      { label: 'Resume', icon: '📄', href: identity.contact.resume },
      { label: 'GitHub', icon: '💻', href: identity.contact.github },
      { label: 'LinkedIn', icon: '💼', href: identity.contact.linkedin },
    ];
  });
}
