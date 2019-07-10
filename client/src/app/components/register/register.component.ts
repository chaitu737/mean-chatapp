import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form;
  Userdata;
  message;
  messageClass;
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
   }


   
    createForm() {
      this.form = this.formBuilder.group({
        // Email Input
        email: ['', Validators.compose([
          Validators.required, // Field is required
          Validators.minLength(5), // Minimum length is 5 characters
          Validators.maxLength(30), // Maximum length is 30 characters
        
        ])],
        // Username Input
        firstName: ['', Validators.required],
        // Password Input
        password: ['', Validators.compose([
          Validators.required, // Field is required
          Validators.minLength(8)  ])],

        lastName:['', Validators.required],
        mobilenumber:['', Validators.required]
        
      }); // Add custom validator to form for matching passwords
    }

    onRegisterSubmit() {
      
      // Create user object form user's inputs
      const user = {
        email: this.form.get('email').value, // E-mail input field
        firstName: this.form.get('firstName').value, // Username input field
        password: this.form.get('password').value, // Password input field
        lastName: this.form.get('lastName').value,
        mobilenumber:this.form.get('mobilenumber').value
      }

      console.log(user);
  
      // Function from authentication service to register user
      this.authService.registerUser(user).subscribe(data => {
        this.Userdata = data;
        // Resposne from registration attempt
        if (!this.Userdata.success) {
          this.messageClass = 'alert alert-danger'; // Set an error class
          this.message = this.Userdata.message; // Set an error message
        
      
        } else {
          this.messageClass = 'alert alert-success'; // Set a success class
          this.message = this.Userdata.message; // Set a success message
          // After 2 second timeout, navigate to the login page
          setTimeout(() => {
            this.router.navigate(['/login']); // Redirect to login view
          }, 2000);
        }
      });
  
     }
  

   
  ngOnInit() {
  }

}
