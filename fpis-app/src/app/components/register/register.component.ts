import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  formdata = {name:"",surname:"",email:"", password:"", birthdate: new Date()};
  submit=false;
  errorMessage="";
  loading=false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {

    this.auth.register(
      this.formdata.name,
      this.formdata.surname,
      this.formdata.password,
      this.formdata.email,
      this.formdata.birthdate.toString(),
    ).subscribe({
      next: (data) => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log('Greskaaa!', error);
      }
    });
    console.log('Registration successful!', this.registerForm.value);
  }
}


