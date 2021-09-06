import { Injectable } from '@angular/core';
import { HttpService } from './core/services/htpp/http.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private httpService: HttpService
  ) { }

  registerUser(use:any) {
    return this.httpService.post('/register', use);
  }
}
