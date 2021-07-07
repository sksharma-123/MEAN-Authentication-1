import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { CheckUsernameValidator } from 'src/app/validators/username-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup = this.initForm();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
  }

  initForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl('', 
      Validators.required, 
      CheckUsernameValidator.checkUsername(this.userService)),
      email: new FormControl('', [
        Validators.required, 
        Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onRegisterSubmit() : void {
    console.log(this.form);
    if(this.form.valid){
      console.log('do something with the form');
      const user = <User>this.form.value;
    }
  }

}
