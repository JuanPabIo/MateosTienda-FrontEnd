import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent {
  descriptionLength: number = 0;

  productId = this.activatedroute.snapshot.params['productId'];

  productForm: FormGroup;
  listOfCategories: any = [];
  selectedFile: File | null;
  imagePreview: string | ArrayBuffer | null;

  existingImage: string | null = null;
  imgChanged = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private activatedroute: ActivatedRoute,
    ){}

    onFileSelected(event: any) {
      this.selectedFile = event.target.files[0];
      this.previewImage();
      this.imgChanged = true;

      this.existingImage = null;
    }

    previewImage(){
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      }
      reader.readAsDataURL(this.selectedFile);
    }

    ngOnInit(): void {
  this.productForm = this.fb.group({
    categoryId: [null, [Validators.required]],
    name: [null, [
      Validators.required,
      Validators.pattern(/^[A-Z][a-zA-Z\s]{4,14}$/) // No numbers, 5-15 characters, starts with uppercase
    ]],
    price: [null, [
      Validators.required,
      Validators.pattern(/^\d{1,6}$/) // Up to 6 digits
    ]],
    description: [null, [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(100),
      Validators.pattern(/^[A-Z].{19,99}$/) // Starts with uppercase, 20-100 characters
    ]],
  });

  this.getAllCategories();
  this.getProductById();
}


    getAllCategories(){
      this.adminService.getAllCategories().subscribe(res=>{
        this.listOfCategories = res;
      })
    }

    getProductById(){
      this.adminService.getProductById(this.productId).subscribe(res=>{
        this.productForm.patchValue(res);
        this.existingImage = 'data:image/jpeg;base64,' + res.byteImg;
      })
    }

    onPriceInput(event: any) {
      const value = event.target.value;
      const isValid = /^\d{1,6}$/.test(value);
      if (!isValid) {
        event.target.value = value.slice(0, -1);
      }
    }
  
    onDescriptionInput(event: any) {
      let value = event.target.value;
  
      // Validación para empezar con mayúscula
      if (value.length === 1) {
        value = value.toUpperCase() + value.slice(1);
        event.target.value = value;
      }
  
      const isValid = /^[A-Za-z\s]{0,99}$/.test(value);
      if (!isValid) {
        event.target.value = value.slice(0, -1);
      }
      this.descriptionLength = event.target.value.length;
    }
  
  
    updateProduct(): void {
      if(this.productForm.valid){
        const formData: FormData = new FormData();

        if(this.imgChanged && this.selectedFile){
          formData.append('img', this.selectedFile);
        }
        
        formData.append('categoryId', this.productForm.get('categoryId').value);
        formData.append('name', this.productForm.get('name').value);
        formData.append('description', this.productForm.get('description').value);
        formData.append('price', this.productForm.get('price').value);

        this.adminService.updateProduct(this.productId,formData).subscribe((res) =>{
          if (res.id != null) {
            this.snackBar.open('Producto actualizado correctamente', 'Cerrar', {
              duration: 5000
            });
            this.router.navigateByUrl('/admin/dashboard');
          }else{
            this.snackBar.open(res.message, 'ERROR', {
              duration: 5000
            });
          }
        })
      }else{
        for (const i in this.productForm.controls) {
          this.productForm.controls[i].markAsDirty();
          this.productForm.controls[i].updateValueAndValidity();
        }
      }
    }

}
