import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  onAddCategory: any = new EventEmitter()
  onEditCategory: any = new EventEmitter()
  categoryForm: any = FormGroup
  dialogAction: any = "Add"
  action: any = "Add"
  responseMessage: any

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialog: MatDialogRef<CategoryComponent>,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]],
    })
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit'
      this.action = 'Update'
      this.categoryForm.patchValue(this.dialogData.data)
    }
  }
  handleSubmit() {

    if (this.dialogAction === "Edit")
      this.edit()
    else
      this.add()
  }
  add() {
    console.log(this.dialogData);

    this.categoryService.add(this.categoryForm.value).subscribe((res: any) => {
      this
        .dialog.close()
      this.responseMessage = res.message
      this.snackbarService.openSnackBar(this.responseMessage, "success")
      this.onAddCategory.emit()
    }, err => {
      this.dialog.close()
      if (err.error?.message) {
        this.responseMessage = err.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
  edit() {
    var data = {
      id: this.dialogData.data.id,
      name: this.categoryForm.value.name
    }
    this.categoryService.update(data).subscribe((res: any) => {
      this
        .dialog.close()
      this.responseMessage = res.message
      this.snackbarService.openSnackBar(this.responseMessage, "success")
      this.onAddCategory.emit()
    }, err => {
      this.dialog.close()
      if (err.error?.message) {
        this.responseMessage = err.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

}
