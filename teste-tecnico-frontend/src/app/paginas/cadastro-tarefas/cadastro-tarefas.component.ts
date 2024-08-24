import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TarefasService } from '../../services/tarefas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getPrioridadeOptions, EnumPrioridadeTarefa } from '../../models/enums/prioridade-enum';
import { Tarefa } from '../../models/tarefa.model';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { CarregamentoService } from '../../services/carregamento.service';

@Component({
  selector: 'app-cadastro-tarefas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-tarefas.component.html',
  styleUrl: './cadastro-tarefas.component.css'
})
export class CadastroTarefasComponent {

  tarefa:string = "";
  prioridadeOptions: { chave: string, valor: EnumPrioridadeTarefa }[] = getPrioridadeOptions();
  prioridadeSelecionada: EnumPrioridadeTarefa =1 ;

  PrioridadeTarefa = EnumPrioridadeTarefa; // Torna o enum acessível no template

  constructor(
    private route: Router,
    private tarefasService:TarefasService,
    private toastr: ToastrService,
    private carregamentoService: CarregamentoService
  ){}


  voltarTarefas(){
    this.route.navigate(['/tarefas'])
  }


  cadastrar(){
    this.carregamentoService.setLoading(true);

    let tarefa = {
      tarefa: this.tarefa,
      prioridade: this.prioridadeSelecionada
    }

    this.tarefasService.cadastrarTarefa(tarefa).subscribe(
      (resp:Tarefa) => {
        this.toastr.success("Tarefa adicionada com sucesso!")
        this.carregamentoService.setLoading(false);
        this.route.navigate(['/tarefas'])
      },
      error => {
        this.carregamentoService.setLoading(false);
        if (error.status === 400) {
          this.toastr.error('Dados inválidos. Por favor, verifique as informações fornecidas.');
        } else if (error.status === 401) {
          this.toastr.error('Não autorizado. Verifique suas credenciais e tente novamente.');
          this.route.navigate(['/'])
        } else if (error.status === 404) {
          this.toastr.error('Recurso não encontrado. Tente novamente mais tarde.');
        } else if (error.status === 500) {
          this.toastr.error('Erro interno do servidor. Por favor, tente novamente mais tarde.');
        } else {
          this.toastr.error('Ocorreu um erro desconhecido. Por favor, tente novamente.');
        }
      }
    )
  }
}
