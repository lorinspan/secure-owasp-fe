import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import {API_URL} from './utils/service-utils';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private feedbackApiUrl: string = API_URL + 'feedback';

  constructor(private http: HttpClient, private authService: AuthService) {}

  submitFeedback(username: string, message: string): Observable<any> {
    if (!message.trim()) {
      console.warn("Feedback cannot be empty!");
      return of({ error: "Feedback cannot be empty!" });
    }

    const payload = { username, message };
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.post(`${this.feedbackApiUrl}/submit`, payload, { headers }).pipe(
      tap(() => console.log("Feedback submitted successfully!")),
      catchError(error => {
        console.error("Error submitting feedback:", error);
        return of({ error: "Failed to submit feedback. You may need to log in." });
      })
    );
  }

  getAllFeedback(): Observable<any[]> {
    return this.http.get<any[]>(`${this.feedbackApiUrl}/all`).pipe(
      tap(() => console.log("Feedback data loaded!")),
      catchError(error => {
        console.error("Error loading feedback:", error);
        return of([]);
      })
    );
  }
}
