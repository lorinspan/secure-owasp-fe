import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import {API_URL} from './utils/service-utils';

@Injectable({
  providedIn: 'root'
})
export class SsrfService {
  private apiUrl = API_URL + 'store-checker/check-stock';

  constructor(private http: HttpClient) {}

  checkStock(storeUrl: string): Observable<{ message?: string; error?: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ message?: string; error?: string }>(
      this.apiUrl,
      { url: storeUrl },
      { headers }
    ).pipe(
      catchError(error => {
        console.error("SSRF Request Failed:", error);
        return of({ error: error.error?.error || 'An unknown error occurred.' });
      })
    );
  }
}
