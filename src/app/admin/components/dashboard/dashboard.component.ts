import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  products: any[] = [];
  searchProductForm!: FormGroup;

  constructor(private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog){}

  ngOnInit(){
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]]
    })
  }

  getAllProducts(){
    this.products = [];
    this.adminService.getAllProducts().subscribe(res =>{
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products)
    })
  }

  submitForm(){
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
    this.adminService.getAllProductsByName(title).subscribe(res =>{
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products)
    })
  }

  deleteProduct(productId: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Producto',
        message: '¿Estás seguro que quieres eliminar este producto?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.deleteProduct(productId).subscribe((res) => {
          console.log(res);
          if (res == null) {
            this.snackBar.open('Producto eliminado exitosamente', 'Cerrar', {
              duration: 5000
            });
            this.getAllProducts();
          } else {
            this.snackBar.open(res.message, 'Cerrar', {
              duration: 5000,
              panelClass: 'error-snackbar'
            });
          }
        });
      }
    });
  }
}
