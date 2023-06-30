import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public result: any;
  public base64Data: any;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    
  }
      
      
  onLogin() {
    console.log(this.loginForm.value)
    this.auth.login(this.loginForm.value)
      .subscribe({
        next: (res) => {
          console.log(res.messsage)
          this.auth.storeToken(res.token);         
          this.result = localStorage.getItem('token')?.toString();
          /*this.getImage();*/
          this.auth.getImg().subscribe({
            next: (result) => {
              console.log(result)

            },

            complete: () => { console.log(this.base64Data) }



          })      
          return this.result;          
        },
        error: (err) => {
          alert(err?.error.message)
        }
      }) 
  }

  getImage() {
    this.http.get('https://localhost:7000/api/User/image').subscribe({
      next: (response: any) => this.base64Data = response,
      error: error => console.log(error),
      complete: () => {
        console.log('request completed')
        console.log(this.base64Data)
        console.log('extra statment')
      }
    }) 

    
  }


  



}
