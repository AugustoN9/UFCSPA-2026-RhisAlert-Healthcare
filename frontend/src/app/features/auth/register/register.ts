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

  // O formulário precisa conhecer TODOS os campos usados no HTML e na lógica
  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required], 
    city: ['', Validators.required],    
    country: ['', Validators.required], 
    userName: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    // Campos de Saúde (Essenciais para o RhisAlert)
    respiratoryConditions: [[] as string[]], 
    interests: [[] as string[]],
    mood: ['']
  });

  // Este método agora vai funcionar porque 'respiratoryConditions' existe no formulário
  toggleCondition(condition: string) {
    const current = this.registerForm.getRawValue().respiratoryConditions || [];
    const index = current.indexOf(condition);
    
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(condition);
    }
    
    this.registerForm.patchValue({ respiratoryConditions: current });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value as any);
      this.router.navigate(['/dashboard']);
    }
  }
}