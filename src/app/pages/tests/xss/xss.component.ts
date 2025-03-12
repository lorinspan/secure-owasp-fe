import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../../services/feedback.service';
import { AuthService } from '../../../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-xss',
  standalone: true,
  templateUrl: './xss.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./xss.component.css']
})
export class XssComponent implements OnInit {
  name: string = '';
  message: string = '';
  feedbackList: any[] = [];
  isLoggedIn: boolean = false;

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadFeedback();
    this.checkUserStatus();
  }

  checkUserStatus() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.authService.getLoggedInUser().subscribe(user => {
        if (user) {
          this.name = user.username;
        }
      });
    }
  }

  submitFeedback() {
    this.feedbackService.submitFeedback(this.name, this.message).subscribe(response => {
      if (response?.error) {
        console.log(response.error);
      } else {
        this.message = '';
        this.loadFeedback();
      }
    });
  }

  loadFeedback() {
    this.feedbackService.getAllFeedback().subscribe(data => {
      this.feedbackList = data.map(fb => ({
        name: fb.username,
        message: this.sanitizer.bypassSecurityTrustHtml(fb.message)
      }));
    });
  }
}
