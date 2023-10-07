import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent {
  displayedColumns: string[] = ['name', 'categoryName', 'description', 'price', 'edit']
  dataSource: any
  length1: any
  responseMessage: any
  constructor(private productService: ProductService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit() {
    this.ngxService.start()
    this.tableData()
  }
  tableData() {
    this.productService.getProduct().subscribe((res: any) => {
      this.ngxService.stop()
      this.dataSource = new MatTableDataSource(res)
    }, (error: any) => {
      this.ngxService.stop()
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }
  handleSubmitAction() {

  }
  handleEditAction(data: any) {
  }

  handleDeleteAction(data: any) {

  }

  onChange(status: any, id: any) {

  }
}
