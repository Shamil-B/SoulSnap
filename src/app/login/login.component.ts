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
  // Add login logic here

  login(){
    this.authService.login(this.user).then((res)=>{
      if(res){
        this.router.navigate(['/collections']);
      }
      else{
        alert("Wrong email or password");
      }
    });
  }
}
