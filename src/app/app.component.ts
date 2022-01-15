import { Component, VERSION } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sigueMe } from './sigueMe';
import { Observable } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { AppService } from './app.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  sigueMes: Observable<any>;

  trinosUser: Observable<any>;

  constructor(private http: HttpClient, private appService: AppService) {}

  getTrinosUser() {
    this.trinosUser = this.appService.getTrinosUser();
  }

  getSigueMe() {
    this.sigueMes = this.appService.getSigueMe();
  }
}
