import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent {
  responseMessage: any
  dataSource: any
  displayedColumns: string[] = ['name', 'edit'];

  constructor(private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()
  }
  tableData() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.ngxService.stop()
      this.dataSource = new MatTableDataSource(res)
      console.log(this.dataSource);

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "850px"
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig)
    this.router.events.subscribe((res: any) => {
      dialogRef.close()
    })
    const sub = dialogRef.componentInstance.onAddCategory.subscribe(() => {
      this.tableData()
    })
  }

  handleEditAction(data: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Edit',
      data: data
    }
    dialogConfig.width = "850px"
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig)
    this.router.events.subscribe((res: any) => {
      dialogRef.close()
    })
    const sub = dialogRef.componentInstance.onAddCategory.subscribe(() => {
      this.tableData()
    })
  }
}
