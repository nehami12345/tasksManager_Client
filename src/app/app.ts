import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { isPlatformBrowser } from '@angular/common';
import { ToastContainer } from './components/toast-container/toast-container';
import { AuthService } from './services/auth/auth';
import { DialogContainer } from './components/dialog-container/dialog-container';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, ToastContainer, DialogContainer],
  template: `
    <div class="app-layout">
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
        <app-toast-container></app-toast-container>
        <app-dialog-container></app-dialog-container>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      padding: 20px;
      background-color: #f4f6f8;
    }
  `]
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.restoreUserSession();
    }
  }
  private restoreUserSession() {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      this.authService.currentUser.set(JSON.parse(savedUser));
    }
  }
}

