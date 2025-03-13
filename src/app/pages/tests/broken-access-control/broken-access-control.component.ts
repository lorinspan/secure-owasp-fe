import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../util/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-bac',
  standalone: true,
  templateUrl: './broken-access-control.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./broken-access-control.component.css']
})
export class BrokenAccessControlComponent implements OnInit {
  username: string = '';
  password: string = '';
  authMessage: string = '';
  isLoggedIn: boolean = false;
  loggedInUser: User | null = null;
  users: User[] = [];
  adminInfo: any = null;
  adminPanelAccess: boolean = false;
  newPassword: string = '';

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.load();
  }

  async onLogin() {
    this.authMessage = '';

    try {
      await firstValueFrom(this.authService.login(this.username, this.password));
      await this.load();
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

  async load() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.loggedInUser = await firstValueFrom(this.authService.getLoggedInUser());
      if (this.isAdmin()) {
        await this.loadUsers();
      }
    }
  }

  isAdmin(): boolean {
    return this.loggedInUser?.role === 'ADMIN';
  }

  async loadUsers() {
    this.users = await firstValueFrom(this.authService.getAllUsers());
  }

  async loadAdminPanel() {
    this.adminPanelAccess = !this.adminPanelAccess;

    if (this.isAdmin() && this.adminPanelAccess) {
      this.adminInfo = await firstValueFrom(this.authService.getAdminConfig());
    } else {
      console.warn('Unauthorized access attempt to admin panel');
    }
  }

  async updateUser(user: User) {
    try {
      await firstValueFrom(this.authService.updateUserByAdmin(user.id, user));
      console.log(`User ${user.id} updated successfully.`);
    } catch (error) {
      console.error("Update failed for user:", user.username, error);
    }
  }

  async deleteUser(userId: number) {
    if (this.isAdmin()) {
      await firstValueFrom(this.authService.deleteUser(userId));
      this.users = this.users.filter(user => user.id !== userId);
    } else {
      console.warn('Unauthorized delete attempt by', this.loggedInUser?.username);
    }
  }

  async updateLoggedUser() {
    if (!this.loggedInUser) return;

    const updatePayload: Partial<User> = {
      username: this.loggedInUser.username,
      email: this.loggedInUser.email,
      role: this.loggedInUser.role
    };

    if (this.newPassword.trim().length > 0) {
      updatePayload.password = this.newPassword;
    }

    try {
      const response = await firstValueFrom(this.authService.updateSelf(updatePayload));
      console.log("User updated successfully:", response);

      if (response.token) {
        this.authService.updateToken(response.token);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  }


  logout() {
    this.authService.logout();
    this.isLoggedIn = this.authService.isAuthenticated();
    this.adminPanelAccess = false;
  }
}
