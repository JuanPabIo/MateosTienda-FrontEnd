import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  ruta: string = "assets/img/logo/logo-mateus.png";
  gimg: string = "assets/img/logo/google.png";
  signupForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),  
        Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)
      ]],
      confirmPassword: [null, [Validators.required]]
    }, { validator: this.checkPasswords });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
        duration: 5000,
        panelClass: 'error-snackbar',
      });
      return;
    }

    this.authService.register(this.signupForm.value).subscribe(
      (response) => {
        this.snackBar.open('Cuenta creada correctamente', 'Cerrar', { duration: 5000 });
        this.router.navigateByUrl('/login');
      },
      (error) => {
        this.snackBar.open('No se ha creado la cuenta. Inténtalo de nuevo', 'Cerrar', {
          duration: 5000,
          panelClass: 'error-snackbar',
        });
      }
    );
  }

  checkPasswords(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  getErrorMessage(field: string): string {
    const control = this.signupForm.get(field);
    if (control?.hasError('required')) {
      return 'Campo obligatorio';
    } else if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    } else if (control?.hasError('pattern')) {
      return 'La contraseña debe contener al menos un número, una letra mayúscula, una letra minúscula y un carácter especial';
    } else if (control?.hasError('notSame')) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }
}
