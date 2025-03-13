import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../../services/feedback.service';
import { AuthService } from '../../../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-xss',
  standalone: true,
  templateUrl: './xss.component.html',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  styleUrls: ['./xss.component.css']
})
export class XssComponent implements OnInit {
  feedbackForm!: FormGroup;
  feedbackList: any[] = [];
  isLoggedIn: boolean = false;
  authMessage: string = '';

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadFeedback();
    this.checkUser();
  }

  initForm() {
    this.feedbackForm = this.formBuilder.group({
      username: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  checkUser() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.authService.getLoggedInUser().subscribe(user => {
        if (user) {
          this.feedbackForm.patchValue({ username: user.username });
          this.feedbackForm.get('username')?.disable({emitEvent: false});
        }
      });
    }
  }

  submitFeedback() {
    this.authMessage = '';

    if (this.feedbackForm.invalid) {
      return;
    }

    const { username, message } = this.feedbackForm.getRawValue();

    this.feedbackService.submitFeedback(username, message).subscribe({
      next: () => {
        this.feedbackForm.patchValue({ message: '' });
        this.loadFeedback();
      },
      error: (error) => {
        if (error.status === 400) {
          this.authMessage = error.error || "An unexpected error occurred.";
        } else {
          console.error("Unhandled error:", error);
        }
      }
    });
  }


  loadFeedback() {
    this.feedbackService.getAllFeedback().subscribe(data => {
      this.feedbackList = data.map(fb => ({
        username: fb.username,
        message: fb.message
      }));
    });
  }
}
