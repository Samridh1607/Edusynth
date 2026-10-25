import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { AuthModal } from './features/auth-modal/auth-modal';
import { CookieConsent } from './features/cookie-consent/cookie-consent';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AuthModal, CookieConsent],
  templateUrl: './app.html',
})
export class App {}
