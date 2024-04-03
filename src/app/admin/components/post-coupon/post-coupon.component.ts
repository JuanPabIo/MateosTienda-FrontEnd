import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-coupon',
  templateUrl: './post-coupon.component.html',
  styleUrls: ['./post-coupon.component.scss']
})
export class PostCouponComponent {

  couponForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.couponForm = this.fb.group({
      name: [null, [Validators.required, this.validateName]],
      code: [null, [Validators.required, this.validateCode]],
      discount: [null, [Validators.required, Validators.max(99)]],
      expirationDate: [null, [Validators.required]],
    });
  }

  validateName(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value || value.length < 5 || value.length > 15 || /\d/.test(value)) {
      return { 'invalidName': true };
    } else {
      return null;
    }
  }

  validateCode(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value || value.length < 3 || value.length > 10 || /\d/.test(value) || value.toUpperCase() !== value) {
      return { 'invalidCode': true };
    } else {
      return null;
    }
  }

  addCoupon(): void {
    if(this.couponForm.valid){
      this.adminService.addCoupon(this.couponForm.value).subscribe(res =>{
        if(res.id != null){
          this.snackBar.open('Cupon creado exitosamente', 'Cerrar', {
            duration: 5000
          });
          this.router.navigateByUrl('/admin/dashboard');
        }else{
          this.snackBar.open(res.message, 'Cerrar', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      })
    }else{
      this.couponForm.markAllAsTouched();
    }
  }
}
