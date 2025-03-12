import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import {API_URL} from './utils/service-utils';

@Injectable({
  providedIn: 'root'
})
export class RemoteExecutionService {
  private apiUrl = API_URL + 'admin/execute';

  constructor(private http: HttpClient, private authService: AuthService) {}

  executeCommand(command: string): Observable<{ output?: string; error?: string }> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError(() => ({ status: 403, error: { error: "You have to be an administrator!" } }));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<{ output?: string; error?: string }>(this.apiUrl, { command }, { headers }).pipe(
      catchError((error) => {
        console.error("HTTP Error:", error);
        return throwError(() => error);
      })
    );
  }
}
