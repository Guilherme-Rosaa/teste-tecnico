import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CarregamentoService } from '../../services/carregamento.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent {
  formCadastro: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private serviceUsuario: UsuarioService,
    private toastr: ToastrService,
    private carregamentoService: CarregamentoService
  ) {
    this.formCadastro = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
  }

  voltarLogin() {
    this.router.navigate(['/']);
  }

  cadastrar() {
    this.carregamentoService.setLoading(true);
    if (this.formCadastro.invalid) {
      this.formCadastro.markAllAsTouched();
      return;
    }

    const cadastro = this.formCadastro.value;

    this.serviceUsuario.cadastrar(cadastro).subscribe(
      (resp: any) => {
        this.toastr.success(`Usuário ${resp.nome} cadastrado com sucesso`);
        this.carregamentoService.setLoading(false);
        this.router.navigate(['/']);
      },
      (error) => {
        this.carregamentoService.setLoading(false);
        if (error.status === 400) {
          this.toastr.error(
            'Dados inválidos. Por favor, verifique as informações fornecidas.'
          );
        } else if (error.status === 404) {
          this.toastr.error(
            'Recurso não encontrado. Tente novamente mais tarde.'
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
}
