import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';

import { AppComponent } from './app.component';
import { EntrarComponent } from './entrar/entrar.component';
import { AppRoutingModule } from './app-routing.module';

import { OlMapsModule } from './ol-maps/ol-maps.module';


@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule,
  OAuthModule.forRoot(), AppRoutingModule, OlMapsModule
  ],
  exports: [AppComponent],
  declarations: [AppComponent, EntrarComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
