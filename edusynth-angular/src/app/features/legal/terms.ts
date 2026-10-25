import { Component } from '@angular/core';
import { LegalPage } from './legal-page';

@Component({
  selector: 'app-terms',
  imports: [LegalPage],
  templateUrl: './terms.html',
  host: { class: 'route-host' },
})
export class Terms {}
