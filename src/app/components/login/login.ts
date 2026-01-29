import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { ToastService } from '../../services/toast/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  email = '';
  password = '';
  errorMsg = '';
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.authService.logout();
  }
  onSubmit() {
    if (!this.email || !this.password) {
      this.toastService.show('Please enter email and password', 'error');
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.show('Welcome back!', 'success');
        this.router.navigate(['/teams']);
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.status === 401 ? 'Invalid credentials' : 'Login failed';
        this.toastService.show(msg, 'error');
        this.cdr.detectChanges();
      }
    });
  }
}