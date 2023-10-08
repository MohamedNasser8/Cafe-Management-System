import { DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  onAddProduct = new EventEmitter()
  onEditProduct = new EventEmitter()
  productForm: any = FormGroup
  dialogAction: any = "Add"
  action: any = "Add"
  responseMessage: any = ""
  categories: any = []
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public dialog: DialogRef,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId: [null, [Validators.required]],
      price: [null, Validators.required],
      description: [null, [Validators.required]],
    })

    this.getCategories()

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit'
      this.action = 'Update'
      this.productForm.patchValue(this.dialogData.data)
    }
  }
  getCategories() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res

    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit()
    } else {
      this.add()
    }
  }
  add() {
    this.productService.add(this.productForm.value).subscribe((res: any) => {
      this.dialog.close()
      this.responseMessage = res.message
      this.snackbarService.openSnackBar(this.responseMessage, "success")
      this.onAddProduct.emit()
    }, error => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, "error")
    })
  }
  edit() {

    var data = { id: this.dialogData.data.id, ...this.productForm.value }
    this.productService.update(data).subscribe((res: any) => {
      this.dialog.close()
      this.responseMessage = res.message
      this.snackbarService.openSnackBar(this.responseMessage, "success")
      this.onEditProduct.emit()
    }, error => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, "error")
    })
  }
}
