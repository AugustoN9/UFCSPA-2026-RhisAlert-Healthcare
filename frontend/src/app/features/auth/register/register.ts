import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Sinais para feedback visual
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    //address: ['', Validators.required], 
    city: ['', Validators.required],    
    country: ['', Validators.required], 
    userName: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    // Estrutura de saúde para o RhisAlert
    respiratoryConditions: [[] as string[]]
  });

  // Lista de condições para o usuário escolher
  availableConditions = [
    { id: 'rinite', label: 'Rinite' },
    { id: 'asma', label: 'Asma' },
    { id: 'sinusite', label: 'Sinusite' }
  ];

  toggleCondition(condition: string) {
    const current = this.registerForm.getRawValue().respiratoryConditions || [];
    const index = current.indexOf(condition);
    const updated = [...current];

    if (index > -1) {
      updated.splice(index, 1);
    } else {
      updated.push(condition);
    }
    
    this.registerForm.patchValue({ respiratoryConditions: updated });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage.set('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validação de senha
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.errorMessage.set('As senhas não coincidem.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Envia para o Backend/Atlas
    this.authService.register(this.registerForm.value as any).subscribe({
      next: () => {
        this.isLoading.set(false);
        console.log('Usuário registrado com sucesso no Atlas!');
        this.router.navigate(['/login']); // Após registrar, vai para o login
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Erro ao criar conta. Verifique se o e-mail já existe.');
        console.error(err);
      }
    });
  }
}