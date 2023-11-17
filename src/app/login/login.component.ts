import { Component } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService : AuthService, private router : Router){}

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/collections']);
    }
  }

  user : User = {
    email:'',
    password:''
  }

  errorMessage : string = "";
  // Add login logic here

  login(){
    // simple validation
    if(this.user.email == "" || this.user.password == ""){
      this.errorMessage = "Please enter email and password";
      return;
    }

    this.authService.login(this.user).then((res)=>{
      if(res === 'success'){
        this.errorMessage = "";
        this.router.navigate(['/collections']);
      }
      else{
        this.errorMessage = res;
      }
    });
  }
}
