import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from '../util/user';
import { API_URL } from './utils/service-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl: string = API_URL + 'auth';
  private userApiUrl: string = API_URL + 'users';
  private adminApiUrl: string = API_URL + 'admin';
  private token: string | null = null;
  private userData: any = null;
  public loggedInUser: User | null = null;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders | null {
    const token = this.getToken();
    return token
      ? new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` })
      : null;
  }

  private handleError(error: any, message: string): Observable<any> {
    console.error(message, error);
    return of({ error: message });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response.token) {
          this.updateToken(response.token);
        }
      })
    );
  }

  register(username: string, password: string, email: string): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, { username, password, email }, { headers: this.getAuthHeaders() || undefined }).pipe(
      tap(() => console.log('User registered successfully!')),
      catchError(error => this.handleError(error, "An unexpected error occurred. Please try again."))
    );
  }

  logout() {
    this.token = null;
    this.userData = null;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getLoggedInUser(): Observable<User | null> {
    const headers = this.getAuthHeaders();
    if (!headers) return this.handleError(null, "No authentication token found!");

    return this.http.get<User>(`${this.userApiUrl}/me`, { headers }).pipe(
      tap(user => this.loggedInUser = user),
      catchError(error => this.handleError(error, "Failed to fetch user data"))
    );
  }

  updateEmail(newEmail: string): Observable<any> {
    return this.updateSelf({ email: newEmail }).pipe(
      tap(() => {
        if (this.loggedInUser) this.loggedInUser.email = newEmail;
      }),
      catchError(error => this.handleError(error, "Failed to update email"))
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    if (!headers) return of([]);
    return this.http.get<User[]>(`${this.userApiUrl}/all`, { headers }).pipe(
      catchError(error => this.handleError(error, "Failed to fetch users"))
    );
  }

  updateUserByAdmin(id: number, user: Partial<User>): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return this.handleError(null, "User not authenticated");
    return this.http.put(`${this.userApiUrl}/${id}`, user, { headers }).pipe(
      catchError(error => this.handleError(error, "Failed to update user"))
    );
  }

  deleteUser(userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return this.handleError(null, "User not authenticated");
    return this.http.delete(`${this.userApiUrl}/${userId}`, { headers }).pipe(
      catchError(error => this.handleError(error, "Failed to delete user"))
    );
  }

  updateSelf(userData: Partial<User>): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return this.handleError(null, "User not authenticated");
    return this.http.put(`${this.userApiUrl}/me/update`, userData, { headers }).pipe(
      catchError(error => this.handleError(error, "Failed to update user"))
    );
  }

  getAdminConfig(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return this.handleError(null, "No authentication token found!");
    return this.http.get(`${this.adminApiUrl}/config`, { headers }).pipe(
      catchError(error => this.handleError(error, "Failed to load admin settings"))
    );
  }

  updateToken(newToken: string) {
    this.token = newToken;
    sessionStorage.setItem('token', newToken);
    const decoded: any = jwtDecode(newToken);
    this.userData = { username: decoded.sub, role: decoded.role };
    sessionStorage.setItem('userData', JSON.stringify(this.userData));
  }
}
