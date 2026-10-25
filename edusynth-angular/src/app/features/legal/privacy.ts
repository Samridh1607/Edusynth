import { Component } from '@angular/core';
import { LegalPage } from './legal-page';

@Component({
  selector: 'app-privacy',
  imports: [LegalPage],
  templateUrl: './privacy.html',
  host: { class: 'route-host' },
})
export class Privacy {}
