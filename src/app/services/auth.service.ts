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
      return true;
    }, err => {
      alert(err.message);
      localStorage.setItem('token', "false");
      return false;
    });
  }

  register(user : User){
    return this.fireauth.createUserWithEmailAndPassword(user.email, user.password).then((user)=>{
      localStorage.setItem('token', "true");
      return true;
    }).catch((err)=>{
      alert(err.message);
      localStorage.setItem('token', "false");
      return false;
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
