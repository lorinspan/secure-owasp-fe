import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SsrfService } from '../../../services/ssrf.service';

@Component({
  standalone: true,
  selector: 'app-ssrf',
  imports: [CommonModule, FormsModule],
  templateUrl: './ssrf.component.html',
  styleUrls: ['./ssrf.component.css']
})
export class SSRFComponent {
  url: string = '';
  response: { message?: string; error?: string } = {};

  constructor(private ssrfService: SsrfService) {}

  checkStock() {
    this.ssrfService.checkStock(this.url).subscribe(data => {
      console.log("Received:", data);
      this.response = data;
    });
  }
}
