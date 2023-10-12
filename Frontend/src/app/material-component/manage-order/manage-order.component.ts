import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent {
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = []
  manageOrderForm: any = FormGroup
  categories: any = []
  products: any = []
  price: any
  totalAmount: number = 0
  responseMessage: any

  constructor(private fromBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private billService: BillService,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService) { }
  ngOnInit() {
    this.ngxService.start()
    this.getCategories()
    this.manageOrderForm = this.fromBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]]
    })

  }
  getCategories() {
    this.categoryService.getFilteredCategories().subscribe((res: any) => {
      this.categories = res
      this.ngxService.stop()
    }, err => {
      this.ngxService.stop()
      if (err.error?.message) {
        this.responseMessage = err.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

  getProductsByCategory(value: any) {
    this.productService.getProductByCategory(value.id).subscribe((res: any) => {
      this.products = res
      this.manageOrderForm.controls['price'].setValue('')
      this.manageOrderForm.controls['quantity'].setValue('')
      this.manageOrderForm.controls['total'].setValue(0)
    }, err => {
      if (err.error?.message) {
        this.responseMessage = err.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe((res: any) => {
      this.price = res.price
      this.manageOrderForm.controls['price'].setValue(res.price)
      this.manageOrderForm.controls['quantity'].setValue(res.quantity)
      this.manageOrderForm.controls['total'].setValue(this.price)
    }, err => {
      if (err.error?.message) {
        this.responseMessage = err.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['price'].value * temp)
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue(1)
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['price'].value)
    }
  }
  validateProductAdd() {
    if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null ||
      this.manageOrderForm.controls['quantity'].value <= 0) {
      return true
    }
    return false
  }

  validateSubmit() {
    if (this.totalAmount == 0 || this.manageOrderForm.controls['name'].value == null || this.manageOrderForm.controls['email'].value == null ||
      this.manageOrderForm.controls['contactNumber'].value == null || this.manageOrderForm.controls['paymentMethod'].value == null) {
      return true
    }
    return false
  }

  add() {
    var data = this.manageOrderForm.value
    var productName = this.dataSource.find((e: { id: number }) => e.id === data.product.id)
    if (productName === undefined) {
      this.totalAmount += data.total
      this.dataSource.push({ id: data.product.id, name: data.product.name, category: data.category.name, quantity: data.quantity, price: data.price, total: data.total })
      this.dataSource = [...this.dataSource]
      this.snackbarService.openSnackBar(GlobalConstants.productAdded, "success")
    } else {
      this.snackbarService.openSnackBar(GlobalConstants.productExistError, "error")
    }
  }

  handleDeleteAction(value: any, element: any) {
    this.totalAmount -= element.total
    this.dataSource.splice(value, 1)
    this.dataSource = [...this.dataSource]
  }

  submitAction() {
    var formData = this.manageOrderForm.value
    formData = { ...formData, productDetails: JSON.stringify(this.dataSource), totalAmount: this.totalAmount }
    console.log(formData);

    this.ngxService.start()
    this.billService.generateReport(formData).subscribe((res: any) => {
      this.downloadFile(res.uuid)
      this.manageOrderForm.reset()
      this.dataSource = []
      this.totalAmount = 0
    }, (err: any) => {
      this.ngxService.stop()
      if (err.error?.message) {
        this.responseMessage = err.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })

  }
  downloadFile(fileName: any) {
    var data = {
      uuid: fileName
    }
    this.billService.getPdf(data).subscribe((res: any) => {
      saveAs(res, fileName + '.pdf')
      this.ngxService.stop()
    })
  }

}
