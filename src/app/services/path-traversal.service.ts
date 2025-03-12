import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import {API_URL} from './utils/service-utils';

@Injectable({
  providedIn: 'root'
})
export class PathTraversalService {
  private apiUrl = API_URL + 'recipes';

  constructor(private http: HttpClient) {}

  getAvailableFiles(): Observable<string[]> {
    return this.http.get<{ recipes: string[] }>(`${this.apiUrl}/list`).pipe(
      map(response => response.recipes || []),
      catchError(error => {
        console.error("Error loading files:", error);
        return of([]);
      })
    );
  }

  readFile(filename: string): Observable<{ content?: string; error?: string }> {
    if (!filename.trim()) {
      return of({ error: "Please enter the file name!" });
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ content?: string; error?: string }>(
      `${this.apiUrl}/read`,
      { filename },
      { headers }
    ).pipe(
      catchError(error => {
        console.error("Error fetching file:", error);
        return of({ error: error.error?.error || "An error has occurred upon reading the file." });
      })
    );
  }
}
