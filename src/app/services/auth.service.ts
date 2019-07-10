import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UsuarioModel} from '../models/usuario.model';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/';
  private apiKey = 'AIzaSyDAMloT4UEH1NafUn2K-p82_u9lIEjw__Y';

  userToken: string;

  constructor(private http: HttpClient) {
    this.readToken()
  }

  login(usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecuretoken: true
    };

    return this.http.post(`${this.url}verifyPassword?key=${this.apiKey}`, authData)
      .pipe(
        map(resp => {
          this.saveToken(resp['idToken']);
          return resp;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

  signUp(usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecuretoken: true
    };

    return this.http.post(`${this.url}signupNewUser?key=${this.apiKey}`, authData)
      .pipe(
        map(resp => {
          this.saveToken(resp['idToken']);
          return resp;
        })
      );
  }

  saveToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let today = new Date();
    today.setSeconds(3600);

    localStorage.setItem('expire', today.getTime().toString());
  }

  readToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  isAuthenticated(): boolean {
    if (this.userToken.length < 2) return false;

    const expire = Number(localStorage.getItem('expire'));
    const expirationDate = new Date();
    expirationDate.setTime(expire);

    if (expirationDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }


}
