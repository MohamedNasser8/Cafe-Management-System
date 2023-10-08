import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

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
  handleAddAction() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = '850px'
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig)
    this.router.events.subscribe(() => {
      dialogRef.close()
    })
    dialogRef.componentInstance.onAddProduct.subscribe((res: any) => {
      this.tableData()
    })
  }

  handleEditAction(data: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Edit',
      data: data
    }
    dialogConfig.width = '850px'
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig)
    this.router.events.subscribe(() => {
      dialogRef.close()
    })
    dialogRef.componentInstance.onEditProduct.subscribe((res: any) => {
      this.tableData()
    })
  }

  handleDeleteAction(data: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      message: 'delete ' + data.names + ' product',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig)
    dialogRef.componentInstance.onEmitStatusChange.subscribe((res: any) => {
      this.ngxService.start()
      this.productService.delete(data.id).subscribe((res: any) => {
        this.ngxService.stop()
        this.responseMessage = res.message
        this.snackbarService.openSnackBar(this.responseMessage, "success")
        this.tableData()
      }, (error: any) => {
        this.ngxService.stop()
        if (error.error?.message) {
          this.responseMessage = error.error?.message
        } else {
          this.responseMessage = GlobalConstants.genericError
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
      })
      dialogRef.close()
    })

  }

  onChange(status: any, id: any) {
    this.ngxService.start()
    var data = {
      status: status.toString(),
      id: id
    }
    this.productService.updateStatus(data).subscribe((res: any) => {
      this.ngxService.stop()
      this.responseMessage = res.message
      this.snackbarService.openSnackBar(this.responseMessage, "success")
    }, error => {
      this.ngxService.stop()
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, "error")
    })
  }
}
