import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { error } from 'console';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent {
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view'];
  dataSource: any
  responseMessage: any

  constructor(private billService: BillService,
    private ngxSevice: NgxUiLoaderService,
    private sanckbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.ngxSevice.start()
    this.tableData()
  }

  tableData() {
    this.billService.getBills().subscribe((res: any) => {
      this.ngxSevice.stop()
      this.dataSource = new MatTableDataSource(res)
    }, err => {
      this.ngxSevice.stop()
      if (err.error?.message) {
        this.responseMessage = err.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.sanckbarService.openSnackBar(this.responseMessage, GlobalConstants.error)

    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  handleViewAction(element: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      data: element
    }
    dialogConfig.width = '100%'
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig)
    this.router.events.subscribe((res: any) => {
      dialogRef.close()
    })
  }

  handleDeleteAction(element: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      message: 'delete ' + element.name + ' bill',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig)
    dialogRef.componentInstance.onEmitStatusChange.subscribe((res: any) => {
      this.ngxSevice.start()
      this.deleteBill(element.id)
    })
  }

  deleteBill(id: any) {
    this.billService.deleteBill(id).subscribe((res: any) => {
      this.ngxSevice.stop()
      this.tableData()
      this.responseMessage = res.message
      this.sanckbarService.openSnackBar(this.responseMessage, "success")
    }, error => {
      this.ngxSevice.stop()
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.sanckbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

  downloadReportAction(value: any) {
    this.ngxSevice.start()
    var data = {
      name: value.name,
      email: value.email,
      uuid: value.uuid,
      contactNumber: value.contactNumber,
      paymentMethod: value.paymentMethod,
      totalAmount: value.total,
      productDetails: value.productDetails
    }
    this.downlaodFile(value.uuid, data)
  }
  downlaodFile(fileName: string, data: any) {
    this.billService.getPdf(data).subscribe((res: any) => {
      saveAs(res, fileName + '.pdf')
      this.ngxSevice.stop()
    })
  }
}
