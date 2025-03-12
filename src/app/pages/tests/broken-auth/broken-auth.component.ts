import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../services/auth.service';
import {User} from '../../../util/user';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-broken-auth',
  standalone: true,
  templateUrl: './broken-auth.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./broken-auth.component.css']
})
export class BrokenAuthComponent implements OnInit {
  username: string = '';
  password: string = '';
  authMessage: string = '';
  sessionToken: string | null = null;

  isLoggedIn: boolean = false;
  loggedInUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    this.getUser();
    this.sessionToken = this.authService.getToken();
  }

  getUser() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.authService.getLoggedInUser().subscribe(user => {
        this.loggedInUser = user;
      });
    }
  }

  async onLogin() {
    this.authMessage = '';

    try {
      await firstValueFrom(this.authService.login(this.username, this.password));
      await this.getDetails();
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

  logout() {
    this.authService.logout();
    this.isLoggedIn = this.authService.isAuthenticated();
  }

}
