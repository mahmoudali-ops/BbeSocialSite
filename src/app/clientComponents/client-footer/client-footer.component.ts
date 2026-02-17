import { Component, inject } from '@angular/core';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { SocailelemntsService } from '../../core/services/socailelemnts.service';

@Component({
  selector: 'app-client-footer',
  standalone: true,
  imports: [TranslatedPipe],
  templateUrl: './client-footer.component.html',
  styleUrl: './client-footer.component.css'
})
export class ClientFooterComponent {

    socailelemnts = inject(SocailelemntsService);
  

}
