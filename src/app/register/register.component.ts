import { Component } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

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

  register(){
    this.authService.register(this.user).then((res)=>{
      if(res){
        this.router.navigate(['/collections']);
      }
      else{
        alert("Register failed");
      }});
  }
}
