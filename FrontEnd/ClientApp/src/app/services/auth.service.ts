import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  

  private authUrl: string = "https://localhost:7000/api/User/authenticate"
  private imageUrl: string = "https://localhost:7000/api/User/image"

  constructor(private http: HttpClient) { }

  login(loginObj: any) {
    return this.http.post<any>(`${this.authUrl}`, loginObj);
  }


  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  getImg() {
    return this.http.get<any>(`${this.imageUrl}`);
  }

  sendStringToBackend(str: string) {
    const url = 'https://localhost:7000/api/User';
    const body = { myString: str };
    return this.http.post(url, body);
  }
  
}
