import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-category',
  templateUrl: './post-category.component.html',
  styleUrls: ['./post-category.component.scss']
})
export class PostCategoryComponent {

  categoryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: [null, [Validators.required, this.validateName, this.validateNameNoNumbers]],
      description: [null, [Validators.required, Validators.minLength(30), Validators.maxLength(100), this.validateDescription]],
    });

    this.categoryForm.get('description')?.valueChanges.subscribe(value => {
      this.characterCount = value.length;
    });
  }

 

  validateNameNoNumbers(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (value && /\d/.test(value)) { // verifica si hay números
      return { 'nameHasNumbers': true };
    } else {
      return null;
    }
  }

  validateName(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value || value.length < 5 || value.length > 10 || value.charAt(0) !== value.charAt(0).toUpperCase()) {
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

  addCategory(): void {
    if(this.categoryForm.valid){
      this.adminService.addCategory(this.categoryForm.value).subscribe((res) =>{
        if (res.id != null) {
          this.snackBar.open('Categoria creada exitosamente', 'Cerrar', {
            duration: 5000
          });
          this.router.navigateByUrl('/admin/dashboard');
        }else{
          this.snackBar.open(res.message, 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      })
    }else{
      this.categoryForm.markAllAsTouched();
    }
  }
}
