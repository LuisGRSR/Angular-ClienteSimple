import { Component, VERSION,EventEmitter,Output, ViewChild, ElementRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sigueMe } from './sigueMe';
import { trino } from './trino';
import { Observable } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { AppService } from './app.service';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './sso.config';
import { Router } from '@angular/router';
import { EntrarComponent } from './entrar/entrar.component';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { Punto } from './punto/punto.types';

@Component({
  selector: "my-app", //Etiqueta para mostrar el componente en el index.html <my-app></my-app> en este caso 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent {
  @Output() localizacionExp = new EventEmitter();
  @Output() details = new EventEmitter;
  @ViewChild('localizacionText',{static:false}) textLocalizacionRef: ElementRef;
  
  
  private sigueMes: Observable<any>;

  trinosUser: Observable<trino>;

  trinos : trino[];

  subscription: any;
  localizacion: String;

  constructor(private http: HttpClient, private appService: AppService,
    private oauthService:OAuthService, private router:Router) {

      this.subscription = this.localizacionExp.subscribe(value=>{
        this.localizacion=value; //obtiene coordenadas pulsadas en el mapa
        this.textLocalizacionRef.nativeElement.value=value;
        //this.textLocalizacionRef.nativeElement.value=value;
    });
    //this.trinosUser = this.appService.getTrinosUser();

    //this.sigueMes = this.appService.getSigueMe();

    this.configureSingleSignOn();
  }


  ngOnInit(): void{
    this.getTrinosUser();
    /*this.trinos.forEach(element => {
        this.details.subscribe(value=>{
          element.Localizacion=value;
        })
        this.details.emit(element);
    });*/
  }


 /*public getDetails():any{

 }*/


  configureSingleSignOn(){
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }


  login(){
      this.oauthService.initImplicitFlow();
  }

  logout(){
      this.oauthService.logOut();
  }

  getTrinosUser() {
    this.appService.getTrinosUser().subscribe(value=> this.trinos = value as trino[]);
  }



  getSigueMe() {
    this.appService.getSigueMe();
  }

  get token(){
    let claims:any = this.oauthService.getIdentityClaims();
    return claims ? claims : null;
  }


  Localizacion($event: any){
    console.log($event);
    this.localizacionExp.emit($event.name);
  }

  Acceder(){
    this.redirectTo('/app-entrar');
  }

  redirectTo(uri:string){
    this.router.navigateByUrl(uri);
  }

}
