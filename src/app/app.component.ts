import { Component, VERSION } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sigueMe } from './sigueMe';
import { trino } from './trino';
import { Observable } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { AppService } from './app.service';
import { AuthConfig, JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './sso.config';
import { Router } from '@angular/router';
import { EntrarComponent } from './entrar/entrar.component';

@Component({
  selector: "my-app", //Etiqueta para mostrar el componente en el index.html <my-app></my-app> en este caso 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  //private sigueMes: Observable<any>;

  //trinosUser: Observable<trino>;

  constructor(private http: HttpClient, private appService: AppService,
    private oauthService:OAuthService, private router:Router) {
    //this.trinosUser = this.appService.getTrinosUser();

    //this.sigueMes = this.appService.getSigueMe();

    this.configureSingleSignOn();
  }

  configureSingleSignOn(){
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }


  ngOnInit(): void{
    

  }


  login(){
      this.oauthService.initImplicitFlow();
  }

  logout(){
      this.oauthService.logOut();
  }

  getTrinosUser() {
    this.appService.getTrinosUser();
  }

  getSigueMe() {
    this.appService.getSigueMe();
  }

  get token(){
    let claims:any = this.oauthService.getIdentityClaims();
    return claims ? claims : null;
  }

  Acceder(){
    this.redirectTo('/app-entrar');
  }

  redirectTo(uri:string){
    this.router.navigateByUrl(uri);
  }

}
