import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../../models/auth.models';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/auth';
    private platformId = inject(PLATFORM_ID);

    currentUser = signal<User | null>(null);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            if (token && savedUser) {
                this.currentUser.set(JSON.parse(savedUser));
            }
        }
    }

    login(credentials: { email: string, password: string }) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => this.handleAuthSuccess(response))
        );
    }
    register(userData: { name: string, email: string, password: string }) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
            tap(response => this.handleAuthSuccess(response))
        );
    }
    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        this.currentUser.set(null);
    }
    private handleAuthSuccess(response: AuthResponse) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        this.currentUser.set(response.user);
    }
    getToken() {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('token');
        }
        return null;
    }
}
