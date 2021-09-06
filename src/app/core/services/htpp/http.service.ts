import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  static API_END_POINT = environment.API;
  private headers: HttpHeaders = new HttpHeaders;
  private params: HttpParams = new HttpParams;
  private responseType: string | undefined;
  private printDirectly!: boolean;

  constructor(
    private http: HttpClient
  ) { }

  private resetOptions(): void {
    this.headers = new HttpHeaders();
    this.params = new HttpParams();
    this.responseType = 'json';
  }

  post<Response>(endpoint: string, body: Object): Observable<any> {
    return this.http.post<Response>(HttpService.API_END_POINT + endpoint, body, this.createOptions())
      .pipe(
        map((response) => (this.extractData(response))),
        catchError(error => {
          return this.handleError(error);
        })
      );
  }
  get(endpoint: string): Observable<any> {
    return this.http
      .get(HttpService.API_END_POINT + endpoint, this.createOptions())
      .pipe(
        map((response) => this.extractData(response)),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }
  private extractData(response: any): any {
    const contentType = response.headers.get('content-type');
    if (contentType) {
      if (contentType.indexOf('application/pdf') !== -1) {
        const blob = new Blob([response.body], { type: 'application/pdf' });
        if (this.printDirectly) {
          const iFrame = document.createElement('iframe');
          iFrame.src = URL.createObjectURL(blob);
          iFrame.style.visibility = 'hidden';
          document.body.appendChild(iFrame);
          iFrame.contentWindow?.focus();
          iFrame.contentWindow?.print();
        } else {
          window.open(window.URL.createObjectURL(blob));
        }
      } else if (contentType.indexOf('application/json') !== -1) {
        return response.body; // with 'text': JSON.parse(response.body);
      }
    } else {
      return response;
      //}
    }
  }
  private header(key: string, value: string): HttpService {
    this.headers = this.headers.append(key, value); // This class is immutable
    return this;
  }
  private createOptions(): any {
    const options: any = {
      headers: this.headers,
      params: this.params,
      responseType: this.responseType,
      observe: 'response',
    };
    this.resetOptions();
    return options;
  }


  private handleError(response: any): any {
    return throwError(response.error);

  }
}
