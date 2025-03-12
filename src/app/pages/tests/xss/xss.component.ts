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

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadFeedback();
    this.checkUser();
  }

  initForm() {
    this.feedbackForm = this.formBuilder.group({
      name: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  checkUser() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.authService.getLoggedInUser().subscribe(user => {
        if (user) {
          this.feedbackForm.patchValue({ name: user.username });
          this.feedbackForm.get('name')?.disable({emitEvent: false});
        }
      });
    }
  }

  submitFeedback() {
    if (this.feedbackForm.invalid) {
      return;
    }

    const { name, message } = this.feedbackForm.value;
    this.feedbackService.submitFeedback(name, message).subscribe(() => {
      this.feedbackForm.patchValue({ message: '' });
      this.loadFeedback();
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
