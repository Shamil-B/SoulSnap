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

  errorMessage : String = "";

  user : User = {
    email:'',
    password:''
  }

  register(){
    // simple validation
    if(this.user.email == "" || this.user.password == ""){
      this.errorMessage = "Please enter email and password";
      return;
    }

    this.authService.register(this.user).then((res)=>{
      if(res === 'success'){
        this.errorMessage = "";
        this.router.navigate(['/collections']);
      }
      else{
        this.errorMessage = res;
      }});
  }
}
