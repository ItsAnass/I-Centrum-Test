import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://localhost:7000/api/User/authenticate"
  private getImage: string = "https://services2.i-centrum.se/recruitment/profile/avatar"

  constructor(private http: HttpClient) { }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}`, loginObj);
  }

  //getImage(loginObj: any) {
  //  return this.http
  //}

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  getImg(token: any) {
    let head_obj = new HttpHeaders().set("Authorization", "Bearer" + token)
    return this.http.get<any>(`${this.getImage}`, { headers: head_obj });
  }
}
