import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss']
})
export class PostProductComponent {

  productForm: FormGroup;
  listOfCategories: any = [];
  selectedFile: File | null;
  imagePreview: string | ArrayBuffer | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ){}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
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
      name: [null, [Validators.required, this.validateProductName, this.validateNameNoNumbers]],
      price: [null, [Validators.required, this.validatePrice]],
      description: [null, [Validators.required, Validators.minLength(30), Validators.maxLength(100), this.validateDescription]],
    });

    this.getAllCategories();
  }



  validateNameNoNumbers(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (value && /\d/.test(value)) { 
      return { 'nameHasNumbers': true };
    } else {
      return null;
    }
  }


  validatePrice(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (value && (value.toString().length > 6)) {
      return { 'invalidPrice': true };
    } else {
      return null;
    }
  }


  getAllCategories(){
    this.adminService.getAllCategories().subscribe(res=>{
      this.listOfCategories = res;
    })
  }

  validateProductName(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value || value.length < 5 || value.length > 15 || value.charAt(0) !== value.charAt(0).toUpperCase()) {
      return { 'invalidName': true };
    } else {
      return null;
    }
  }

  validateDescription(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value || value.length < 30 || value.charAt(0) !== value.charAt(0).toUpperCase()) {
      return { 'invalidDescription': true };
    } else {
      return null;
    }
  }

  characterCount: number = 0;

  addProduct(): void {
    if(this.productForm.valid){
      const formData: FormData = new FormData();
      formData.append('img', this.selectedFile);
      formData.append('categoryId', this.productForm.get('categoryId').value);
      formData.append('name', this.productForm.get('name').value);
      formData.append('description', this.productForm.get('description').value);
      formData.append('price', this.productForm.get('price').value);

      this.adminService.addProduct(formData).subscribe((res) =>{
        if (res.id != null) {
          this.snackBar.open('Producto creado correctamente', 'Cerrar', {
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
      this.productForm.markAllAsTouched();
    }
  }
}
