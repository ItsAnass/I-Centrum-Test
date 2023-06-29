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

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router/*, private http: HttpClient*/) { }

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
          /*let token = localStorage.getItem('token')*/
          //this.auth.getImg(token).subscribe((data) => {
          this.result = localStorage.getItem('token')?.toString();
          //  console.log(this.result)

         /* this.result = res;*/
          /*console.log(this.result)*/
          /*this.router.navigate(['dashboard'])*/
          return this.result;
          
        },
        error: (err) => {
          alert(err?.error.message)
        }
      })

  }
}
