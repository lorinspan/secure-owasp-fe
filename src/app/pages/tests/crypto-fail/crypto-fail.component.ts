import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../util/user';
import {firstValueFrom} from 'rxjs';
import {EMAIL_PATTERN, PASSWORD_PATTERN} from '../../../util/secure-owasp-fe.utils';

@Component({
  standalone: true,
  selector: 'app-crypto-fail',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './crypto-fail.component.html',
  styleUrl: './crypto-fail.component.css'
})
export class CryptoFailComponent implements OnInit {
  registerForm!: FormGroup;
  changeEmailForm!: FormGroup;
  loginUsername: string = '';
  loginPassword: string = '';
  activeTab: string = 'login';
  authMessage: string = '';
  showModal: boolean = true;

  isLoggedIn: boolean = false;
  loggedInUser: User | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.getUser();
    this.initForms();
  }

  getUser() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.authService.getLoggedInUser().subscribe(user => {
        this.loggedInUser = user;
      });
    }
  }

  switchTab(tab: string) {
    this.authMessage = '';
    this.activeTab = tab;
  }

  initForms() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.pattern(PASSWORD_PATTERN)
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern(EMAIL_PATTERN)
      ]]
    });

    this.changeEmailForm = this.fb.group({
      newEmail: ['', [
        Validators.required,
        Validators.pattern(EMAIL_PATTERN)
      ]]
    });
  }

  onRegister() {
    this.authMessage = '';

    const { username, password, email } = this.registerForm.value;

    this.authService.register(username, password, email).subscribe(response => {
      if (response.error) {
        this.authMessage = response.error;
      } else {
        this.onLogin(username, password);
      }
    });
  }

  async onLogin(username: string = this.loginUsername, password: string = this.loginPassword) {
    this.authMessage = '';

    try {
      await firstValueFrom(this.authService.login(username, password));
      await this.getUser();
    } catch (error: any) {
      if (error.status === 429) {
        this.authMessage = "Too many requests, please try again in one minute.";
      } else if (error.status === 401) {
        this.authMessage = "Invalid username or password!";
      } else {
        this.authMessage = "An unexpected error occurred. Please try again later.";
      }
    }
  }

  onChangeEmail() {
    if (this.changeEmailForm.invalid) {
      console.log("Please enter a valid email.");
      return;
    }

    const { newEmail } = this.changeEmailForm.value;

    this.authService.updateEmail(newEmail).subscribe(response => {
      if (response.error) {
        console.log("Failed to update email: " + response.error);
      } else {
        console.log("Email updated successfully!");
        this.loggedInUser!.email = newEmail;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  claimPrize() {  // Simulam un redirect malitios
    if (this.isLoggedIn && this.loggedInUser?.id) {
      window.open(`http://localhost:9000/index.html?id=${this.loggedInUser?.id}`, '_blank');
    } else if (this.isLoggedIn && !this.loggedInUser?.id) {
      console.log("There was an error claiming the prize! Unlucky!");
    } else {
      console.log("You must be logged in to claim the prize!");
    }
  }

  closeModal() {
    this.showModal = false;
  }
}
