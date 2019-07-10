import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators } from "@angular/forms";
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form;
  UserDetails;
  messageClass;
  message;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { 
    this.createForm();
  }


  createForm(){
    this.form = this.formBuilder.group({
      email: ['', Validators.required], // Username field
      password: ['', Validators.required] // Password field
    });
  
  }


  onLoginSubmit() {
   
    const user = {
      email: this.form.get('email').value, // Username input field
      password: this.form.get('password').value // Password input field
    }


    // Function to send login data to API
    this.authService.login(user).subscribe(data => {
this.UserDetails = data;
      // Check if response was a success or error
      if (!this.UserDetails.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = this.UserDetails.message; // Set error message
    
      } else {
        this.messageClass = 'alert alert-success'; // Set bootstrap success class
        this.message = this.UserDetails.message; 
        // Function to store user's token in client local storage
        this.authService.storeUserData(this.UserDetails.token, this.UserDetails.user);
        // localStorage.setItem('receiverId',this.UserDetails.user.userId);
        // localStorage.setItem('receiverName', this.UserDetails.user.firstName + ''+ this.UserDetails.user.lastName);
        // After 2 seconds, redirect to dashboard page
        setTimeout(() => {
          // Check if user was redirected or logging in for first time
            
            this.router.navigate(['/chat']); // Navigate to dashboard view
          
        }, 2000);
      }
    });
  }
  ngOnInit() {
  }

}
