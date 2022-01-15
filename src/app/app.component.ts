import { Component, VERSION } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sigueMe } from './sigueMe';
import { trino } from './trino';
import { Observable } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { AppService } from './app.service';

@Component({
  selector: "my-app", //Etiqueta para mostrar el componente en el index.html <my-app></my-app> en este caso 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  //private sigueMes: Observable<any>;

  //trinosUser: Observable<trino>;

  constructor(private http: HttpClient, private appService: AppService) {
    //this.trinosUser = this.appService.getTrinosUser();

    //this.sigueMes = this.appService.getSigueMe();
  }


  ngOnInit(): void{
    

  }

  getTrinosUser() {
    this.appService.getTrinosUser();
  }

  getSigueMe() {
    this.appService.getSigueMe();
  }
}
