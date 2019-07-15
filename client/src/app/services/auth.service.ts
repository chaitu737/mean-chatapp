import { Injectable } from '@angular/core';
 import 'rxjs/add/operator/map';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   domain = "http://localhost:3000/"
  
  authToken;
  user;

  constructor(
     private http: HttpClient
  ) { }

  loadToken(){
    this.authToken = localStorage.getItem('token');
  }
  registerUser(user){
     return this.http.post(this.domain + 'authentication/register', user).map(res=>res)
  }

  login(user) {
     return this.http.post(this.domain + 'authentication/login', user).map(res => res);
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token); // Set token in local storage
    localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
    this.authToken = token; // Assign token to be used elsewhere
    this.user = user; // Set user to be used elsewhere
  }

logout(){

  const params = new HttpParams()
      .set('authToken', this.authToken);

      return this.http.post(this.domain + 'authentication/logout', params);

}


}
