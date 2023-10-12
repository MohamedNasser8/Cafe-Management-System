import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { error } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent {
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status'];
  dataSource: any
  responseMessage: any
  constructor(private ngxService: NgxUiLoaderService,
    private userService: UserService,
    private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.ngxService.start()
    this.tableData()
  }
  tableData() {
    this.userService.getUsers().subscribe((res: any) => {
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

  onChange(status: any, id: any) {
    this.ngxService.start()
    var data = {
      status: status.toString(),
      id: id
    }

    this.userService.updateUser(data).subscribe((res: any) => {
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
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
}
