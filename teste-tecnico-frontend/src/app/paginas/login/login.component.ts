import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormsModule, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { LoginUsuario } from '../../models/login-usuario.model';
import { Token } from '../../models/token.model';
import { ToastrService } from 'ngx-toastr';
import { CarregamentoService } from '../../services/carregamento.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private route: Router,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private carregamentoService: CarregamentoService
  ) {}

  ngOnInit(): void {
      let token = localStorage.getItem("TOKEN");
      if(token){
        this.route.navigate(['/tarefas'])
      }
  }

  email: string = '';
  senha: string = '';

  login: LoginUsuario = {
    email: '',
    senha: '',
  };

  fazerLogin() {
    this.carregamentoService.setLoading(true);

    this.login = {
      email: this.email,
      senha: this.senha,
    };

    if (this.camposInvalidos()){
      this.carregamentoService.setLoading(false);
      return
    }
      this.usuarioService.login(this.login).subscribe(
        (resp: Token) => {
          this.toastr.success('Login realizado com sucesso!');
          localStorage.setItem('TOKEN', resp.token);
          this.carregamentoService.setLoading(false);
          this.route.navigate(['/tarefas']);
        },
        (error) => {
          this.carregamentoService.setLoading(false);
          if (error.status === 400) {
            this.toastr.error(
              'Dados inválidos. Por favor, verifique as informações fornecidas.'
            );
          } else if (error.status === 404) {
            this.toastr.error(
              error.error.error
            );
          } else if (error.status === 500) {
            this.toastr.error(
              'Erro interno do servidor. Por favor, tente novamente mais tarde.'
            );
          } else {
            this.toastr.error(
              'Ocorreu um erro desconhecido. Por favor, tente novamente.'
            );
          }
        }
      );
  }

  camposInvalidos(){
    if(!this.email){
      this.toastr.error("Insira um e-mail para prosseguir!");
      return true;
    }
    if(!this.validarEmail()){
      this.toastr.error("Insira um e-mail válido!");
      return true;
    }
    if(!this.senha){
      this.toastr.error("Insira a senha para prosseguir!");
      return true;
    }
    return false;
  }

  validarEmail(): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(this.email);
  }

  cadastro() {
    this.route.navigate(['/cadastro']);
  }
}
