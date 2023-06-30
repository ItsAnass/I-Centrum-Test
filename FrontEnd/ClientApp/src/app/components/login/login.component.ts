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
          this.auth.getImg().subscribe({
            next: (result) => {
              console.log(result)
            }})      
          return this.result;          
        },
        error: (err) => {
          alert(err?.error.message)
        }
      }) 
  }

   myString = 'Hello, C# backend!';
  test() {
    this.auth.sendStringToBackend(this.myString).subscribe(
      response => {
        console.log('String sent successfully!');
        // Handle the response from the backend if needed
      },
      error => {
        console.error('Error sending string:', error);
        // Handle the error if needed
      }
    );
  }
  


  



}
