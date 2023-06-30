import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  

  private baseUrl: string = "https://localhost:7000/api/User/authenticate"
  private getImage: string = "https://localhost:7000/api/User/image"

  constructor(private http: HttpClient) { }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}`, loginObj);
  }


  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  getImg() {
    return this.http.get<any>(`${this.getImage}`);
  }

  //public creat_image(data: any) {
  //  return this.http.
  //}

  //public get_image() {
  //  return this.http.get(this.getImage);
  //}
}
