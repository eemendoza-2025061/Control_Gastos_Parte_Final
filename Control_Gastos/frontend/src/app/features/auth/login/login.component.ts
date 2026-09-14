import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  errorMessage = '';
  sessionMessage = '';

  ngAfterViewInit(): void {
    if (!environment.googleClientId) return;

    const renderGoogleButton = () => {
      const google = (window as any).google;
      const container = document.getElementById('google-login-button');
      if (google?.accounts?.id && container) {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: { credential: string }) => this.loginWithGoogle(response.credential)
        });
        google.accounts.id.renderButton(container, { theme: 'outline', size: 'large', width: 340, text: 'continue_with' });
      }
    };

    if ((window as any).google?.accounts?.id) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);
  }

  private loginWithGoogle(credential: string): void {
    this.isLoading = true;
    this.authService.loginWithGoogle(credential).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message;
      }
    });
  }

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state || history.state;
    if (state?.sessionMessage) {
      this.sessionMessage = state.sessionMessage;
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message;
      }
    });
  }
}