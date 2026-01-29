import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { ToastService } from '../../services/toast/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  name = '';
  email = '';
  password = '';
  errorMsg = '';
  isLoading = false;

  emailExistsError = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  onSubmit() {
    if (!this.name || !this.email || !this.password) {
      this.toastService.show('Please fill in all required fields.', 'error');
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';
    this.emailExistsError = false;

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.toastService.show('Registration successful!', 'success');
        this.router.navigate(['/teams']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.emailExistsError = true;
          this.toastService.show('Email already registered', 'error');
        } else if (err.status === 400) {
          this.toastService.show('Invalid data provided. Please check your inputs.', 'error');
        } else {
          this.toastService.show('Registration failed', 'error');
        }
      }
    });
  }
}
