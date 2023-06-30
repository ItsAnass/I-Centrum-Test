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
  public imageUrl: any;

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
          return this.result;
        },
        error: (err) => {
          alert(err?.error.message)
        },
        complete: () => {
          this.getImage(),
          this.downloadFile()
        }
      })

  }

  getImage() {
    this.auth.getImg().subscribe({
      next: (res: any) => {
        this.base64Data = res.b64Code
        console.log(this.base64Data)
      },
      error: (err) => {
        alert(err?.error.message)
      }

    });
  }

  downloadFile() {
    let toBase64 = btoa(this.base64Data); 
    const byteArray = new Uint8Array(atob(toBase64).split('').map(char => char.charCodeAt(0)));
    const file = new Blob([byteArray], { type:'image/jpeg'})
    this.imageUrl = URL.createObjectURL(file);
       
  }


}



