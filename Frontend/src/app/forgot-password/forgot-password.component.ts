import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: any = FormGroup
  responseMessage: any
  constructor(private fromBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fromBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]
    })
  }

  handleSubmit() {
    this.ngxService.start()
    var data = this.forgotPasswordForm.value
    this.userService.forgotPassword(data).subscribe((res: any) => {
      this.ngxService.stop()
      this.responseMessage = res?.message
      this.dialogRef.close()
      this.snackBarService.openSnackBar(this.responseMessage, '')
    }, err => {
      this.ngxService.stop()
      if (err.error?.message) {
        this.responseMessage = err.error?.message
      } else {
        this.responseMessage = GlobalConstants.error
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
}
