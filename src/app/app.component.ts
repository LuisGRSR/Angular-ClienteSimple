import { Component, VERSION,EventEmitter,Output, ViewChild, ElementRef, Input, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sigueMe } from './sigueMe';
import { trino } from './trino';
import { BehaviorSubject, Observable } from 'rxjs';
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
  @ViewChild('LocalizacionText',{static:false}) textLocalizacionRef: ElementRef;

  @ViewChild('Autor',{static:false}) AutorSelect: ElementRef;
  @ViewChild('Destinatario',{static:false}) DestinatarioSelect: ElementRef;
  @ViewChild('Post',{static:false}) Mensaje: ElementRef;
  @ViewChild('coordenadasText',{static:false}) CoordenadasText: ElementRef;
  
  
  sigueMes: sigueMe[] = [];

  //trinosUser: Observable<trino>;

  trinos : trino[];

  usuarios : String[]=[];

  subscription: any;
  localizacion: String;

  trinoSubmit:trino;

  puntoSelect:Punto;

  testEmitter$ = new BehaviorSubject<sigueMe[]>(this.sigueMes);

  constructor(private http: HttpClient, private appService: AppService,
    private oauthService:OAuthService, private router:Router, private ngZone: NgZone) {

      this.subscription = this.localizacionExp.subscribe(value=>{
        this.localizacion=value; //obtiene coordenadas pulsadas en el mapa
        
        
        this.puntoSelect= value ;
        this.CoordenadasText.nativeElement.value="Lat: "+this.puntoSelect.lat.toString()+" , "+"Lon: "+this.puntoSelect.lon.toString();
        this.textLocalizacionRef.nativeElement.value=this.puntoSelect.name;
        //this.textLocalizacionRef.nativeElement.value=value;
      });
    //this.trinosUser = this.appService.getTrinosUser();

    //this.sigueMes = this.appService.getSigueMe();

    this.configureSingleSignOn();
  }


  ngOnInit(): void{
    this.getTrinosUser();
    this.getSigueMe();


    this.sigueMes.forEach(element => { //Forma de buscar todos los usuarios un poco extraña
        if(!this.usuarios.includes(element.seguido)){
            this.usuarios.push(element.seguido); 
        }
        if(!this.usuarios.includes(element.seguidor)){
          this.usuarios.push(element.seguidor); 
        }
    });
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
    this.appService.getSigueMe().subscribe(value=>{ 
      //this.sigueMes = value as sigueMe[];
      /*this.ngZone.run( ()=> {
        this.sigueMes=value as sigueMe[];
      });*/
      this.sigueMes=value as sigueMe[];

      this.sigueMes.forEach(element => { //Forma de buscar todos los usuarios un poco extraña
        if(!this.usuarios.includes(element.seguido)){
            this.usuarios.push(element.seguido); 
        }
        if(!this.usuarios.includes(element.seguidor)){
          this.usuarios.push(element.seguidor); 
        }
      });

      this.testEmitter$.next(this.sigueMes);
      //console.log(this.sigueMes);
    
    
    });
    //this.sigueMes= this.appService.getSigueMe() as sigueMe[];
  }

  get token(){
    let claims:any = this.oauthService.getIdentityClaims();
    return claims ? claims : null;
  }


  Localizacion($event: any){
    console.log($event);
    this.localizacionExp.emit($event);
  }


  EnviarDatos(){
    this.trinoSubmit=new trino();
    this.trinoSubmit.autor=this.AutorSelect.nativeElement.value;
    this.trinoSubmit.post=this.Mensaje.nativeElement.value;
    this.trinoSubmit.lat=this.puntoSelect.lat;
    this.trinoSubmit.lon=this.puntoSelect.lon;

    this.appService.postTrino(this.trinoSubmit);
  }

  Acceder(){
    this.redirectTo('/app-entrar');
  }

  redirectTo(uri:string){
    this.router.navigateByUrl(uri);
  }

}
