import { Component, Injectable, VERSION } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sigueMe } from './sigueMe';
import { Observable } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly ROOT_URL = 'https://immense-badlands-41207.herokuapp.com';


  constructor(private http: HttpClient) {}

  getTrinosUser(): Observable<any> {
    return this.http.get(this.ROOT_URL + 'api/Trinos');
  }

  getSigueMe(): Observable<any> {
    return this.http.get(this.ROOT_URL + '/api/SigueMe');
  }
}
