import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { fireEvent, render, screen } from '@testing-library/angular';
import { WINDOW } from '../../core/tokens/window.token';
import { ContactPageComponent } from './contact-page.component';

describe('ContactPageComponent', () => {
  const providers = [provideHttpClient(), provideHttpClientTesting()];

  function flushIdentity(): void {
    TestBed.inject(HttpTestingController)
      .match(() => true)
      .forEach((req) =>
        req.flush(
          req.request.url === 'assets/data/identity.json'
            ? {
                contact: {
                  email: 'me@example.com',
                  github: 'https://github.com/me',
                  linkedin: 'https://linkedin.com/in/me',
                },
              }
            : null,
        ),
      );
  }

  it('renders only the form, without the contact details', async () => {
    const { detectChanges } = await render(ContactPageComponent, { providers });
    flushIdentity();
    detectChanges();

    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Get in touch');
    expect(screen.getByLabelText('Name')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Subject')).toBeTruthy();
    expect(screen.getByLabelText('Message')).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'me@example.com' })).toBeNull();
  });

  it('offers the email address when sending fails', async () => {
    const { detectChanges } = await render(ContactPageComponent, { providers });
    flushIdentity();

    fireEvent.input(screen.getByLabelText('Name'), { target: { value: 'Ada' } });
    fireEvent.input(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
    fireEvent.input(screen.getByLabelText('Subject'), { target: { value: 'Hello' } });
    fireEvent.input(screen.getByLabelText('Message'), { target: { value: 'Can we talk?' } });
    fireEvent.click(screen.getByRole('button', { name: /Send message/ }));

    TestBed.inject(HttpTestingController)
      .expectOne('https://api.emailjs.com/api/v1.0/email/send')
      .flush('Bad request', { status: 400, statusText: 'Bad Request' });
    await Promise.resolve();
    detectChanges();

    expect(screen.getByRole('link', { name: 'me@example.com' }).getAttribute('href')).toBe(
      'mailto:me@example.com',
    );
  });

  it('shows validation errors instead of sending an empty form', async () => {
    await render(ContactPageComponent, { providers });

    fireEvent.click(screen.getByRole('button', { name: /Send message/ }));

    expect(screen.getByText('Please enter your name.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid email address.')).toBeTruthy();
  });

  it('sends the message through EmailJS and confirms it', async () => {
    const { detectChanges } = await render(ContactPageComponent, { providers });
    flushIdentity();

    fireEvent.input(screen.getByLabelText('Name'), { target: { value: 'Ada' } });
    fireEvent.input(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
    fireEvent.input(screen.getByLabelText('Subject'), { target: { value: 'Hello' } });
    fireEvent.input(screen.getByLabelText('Message'), { target: { value: 'Can we talk?' } });
    fireEvent.click(screen.getByRole('button', { name: /Send message/ }));

    const req = TestBed.inject(HttpTestingController).expectOne(
      'https://api.emailjs.com/api/v1.0/email/send',
    );
    expect(req.request.body.template_params).toEqual({
      from_name: 'Ada',
      from_email: 'ada@example.com',
      subject: 'Hello',
      message: 'Can we talk?',
      to_email: 'me@example.com',
    });
    req.flush('OK');
    await Promise.resolve();
    detectChanges();

    expect(screen.getByRole('status').textContent).toContain('Your message is on its way');
  });

  it('closes the tab on "Back to portfolio" when the browser allows it', async () => {
    const assign = vi.fn();
    const fakeWindow = {
      closed: false,
      close: vi.fn(() => (fakeWindow.closed = true)),
      location: { assign },
    };
    await render(ContactPageComponent, {
      providers: [...providers, { provide: WINDOW, useValue: fakeWindow }],
    });

    fireEvent.click(screen.getByRole('button', { name: /Back to portfolio/ }));

    expect(fakeWindow.close).toHaveBeenCalled();
    expect(assign).not.toHaveBeenCalled();
  });

  it('goes to the home page when the tab cannot be closed', async () => {
    const assign = vi.fn();
    const fakeWindow = { closed: false, close: vi.fn(), location: { assign } };
    await render(ContactPageComponent, {
      providers: [...providers, { provide: WINDOW, useValue: fakeWindow }],
    });

    fireEvent.click(screen.getByRole('button', { name: /Back to portfolio/ }));

    expect(assign).toHaveBeenCalledWith('/');
  });
});
