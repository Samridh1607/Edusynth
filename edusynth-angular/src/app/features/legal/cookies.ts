import { Component } from '@angular/core';
import { LegalPage } from './legal-page';

@Component({
  selector: 'app-cookies',
  imports: [LegalPage],
  templateUrl: './cookies.html',
  host: { class: 'route-host' },
})
export class Cookies {}
