import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  // Sinal para mensagens de erro reativas
  errorMessage = signal<string | null>(null);
  // Sinal para indicar que a requisição está em processamento
  isLoading = signal<boolean>(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    // Captura os dados do formulário como um objeto { email, password }
    const credentials = this.loginForm.getRawValue() as { email: string; password: string };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        const user = this.authService.currentUser();
        
        // Lógica de redirecionamento baseada no perfil de saúde
        if (user?.respiratoryConditions && user.respiratoryConditions.length > 0) {
          console.log('Login bem-sucedido. Indo para o Dashboard.');
          this.router.navigate(['/dashboard']);
        } else {
          console.log('Perfil de saúde incompleto. Indo para Registro.');
          this.router.navigate(['/register']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Erro na autenticação:', err);
        this.errorMessage.set('E-mail ou senha incorretos. Verifique seus dados.');
      }
    });
  }
}