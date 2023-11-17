import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth : AngularFireAuth, private router:Router) { }

  login(user : User){
    return this.fireauth.signInWithEmailAndPassword(user.email, user.password).then((user)=>{
      localStorage.setItem('token', "true");
      return 'success';
    }, err => {
      localStorage.setItem('token', "false");
      return err.message;
    });
  }

  register(user : User){
    return this.fireauth.createUserWithEmailAndPassword(user.email, user.password).then((user)=>{
      localStorage.setItem('token', "true");
      return 'success';
    }).catch((err)=>{
      localStorage.setItem('token', "false");
      return err.message;
    });
  }

  logout(){
    this.fireauth.signOut().then(()=>{
      localStorage.setItem('token', "false");
      this.router.navigate(['/login']);
    }).catch((err)=>{
      alert(err.message);
    });
  }

  isLoggedIn(){
    return localStorage.getItem('token') === "true";
  }
}
