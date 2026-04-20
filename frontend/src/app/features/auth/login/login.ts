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

  // Sinal para gerenciar mensagens de erro de forma reativa
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onLogin() {
    this.errorMessage.set(null);
    const email = this.loginForm.value.email!;
    
    // Tenta realizar o login via AuthService
    const success = this.authService.login(email);

    if (success) {
      // Verifica se o usuário tem o perfil de saúde preenchido
      const user = this.authService.currentUser();
      
      if (user?.respiratoryConditions && user.respiratoryConditions.length > 0) {
        console.log('Usuário com perfil de saúde identificado. Indo para o Dashboard.');
        this.router.navigate(['/dashboard']); // Ajuste para sua rota de destino
      } else {
        console.log('Perfil incompleto detectado.');
        this.router.navigate(['/register']);
      }
    } else {
      this.errorMessage.set('Usuário não encontrado. Verifique o e-mail ou crie uma conta.');
    }
  }
}
