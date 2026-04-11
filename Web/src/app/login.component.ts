import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>WeatherApp</h1>
        <p class="subtitle">Faça login para acessar sua previsão do tempo</p>

        <div *ngIf="!isRegister" class="form-section">
          <h2>Login</h2>
          <form (ngSubmit)="onLogin()">
            <div class="form-group">
              <label>Usuário</label>
              <input
                type="text"
                [(ngModel)]="username"
                name="username"
                placeholder="Digite seu usuário"
                required
              />
            </div>
            <div class="form-group">
              <label>Senha</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Digite sua senha"
                required
              />
            </div>
            <button type="submit" class="btn-primary">Entrar</button>
            <p class="error" *ngIf="error">{{ error }}</p>
            <p class="toggle-form">
              Não tem uma conta?
              <a (click)="toggleRegister()" class="link">Registre-se aqui</a>
            </p>
          </form>
        </div>

        <div *ngIf="isRegister" class="form-section">
          <h2>Registrar</h2>
          <form (ngSubmit)="onRegister()">
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="Digite seu email"
                required
              />
            </div>
            <div class="form-group">
              <label>Usuário</label>
              <input
                type="text"
                [(ngModel)]="username"
                name="username"
                placeholder="Digite um usuário"
                required
              />
            </div>
            <div class="form-group">
              <label>Senha</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Digite uma senha"
                required
              />
            </div>
            <button type="submit" class="btn-primary">Registrar</button>
            <p class="error" *ngIf="error">{{ error }}</p>
            <p class="toggle-form">
              Já tem uma conta?
              <a (click)="toggleRegister()" class="link">Faça login aqui</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 10px;
      font-size: 28px;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      box-sizing: border-box;
      transition: border-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .btn-primary {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
    }

    .error {
      color: #d32f2f;
      margin-top: 10px;
      font-size: 14px;
      text-align: center;
    }

    .toggle-form {
      text-align: center;
      color: #666;
      margin-top: 20px;
      font-size: 14px;
    }

    .link {
      color: #667eea;
      cursor: pointer;
      font-weight: 600;
      text-decoration: none;
    }

    .link:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  isRegister: boolean = false;
  error: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService) {}

  toggleRegister(): void {
    this.isRegister = !this.isRegister;
    this.error = '';
    this.username = '';
    this.password = '';
    this.email = '';
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.error = 'Preencha todos os campos';
      return;
    }

    this.loading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        window.location.reload();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Usuário ou senha inválidos';
      }
    });
  }

  onRegister(): void {
    if (!this.email || !this.username || !this.password) {
      this.error = 'Preencha todos os campos';
      return;
    }

    this.loading = true;
    this.authService.register(this.email, this.username, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        this.error = '';
        this.isRegister = false;
        this.email = '';
        this.username = '';
        this.password = '';
        alert('Registrado com sucesso! Faça login agora.');
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erro ao registrar. Tente outro usuário ou email.';
      }
    });
  }
}
