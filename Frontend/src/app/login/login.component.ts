import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { error } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  loginForm: any = FormGroup;
  responseMessage: any
  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    public dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService,
    private snackBar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]]
    })
  }

  handleSubmit() {
    this.ngxService.start();
    var data = this.loginForm.value;
    this.userService.login(data).subscribe((res: any) => {
      this.ngxService.stop();
      this.dialogRef.close();
      localStorage.setItem('token', res.token);
      this.router.navigate(['/cafe/dashboard']);
    }, error => {
      this.ngxService.stop();

      if (error.error?.message)
        this.responseMessage = error.error?.message;
      else
        this.responseMessage = GlobalConstants.error;
      this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
}
