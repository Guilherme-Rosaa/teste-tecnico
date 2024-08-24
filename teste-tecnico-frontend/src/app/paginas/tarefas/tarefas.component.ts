import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TarefasService } from '../../services/tarefas.service';
import { EnumPrioridadeTarefa } from '../../models/enums/prioridade-enum';
import { Router } from '@angular/router';
import { CarregamentoService } from '../../services/carregamento.service';
import { Tarefa } from '../../models/tarefa.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tarefas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarefas.component.html',
  styleUrl: './tarefas.component.css',
})
export class TarefasComponent implements OnInit {
  tarefas: Tarefa[] = [];

  constructor(
    private route: Router,
    private tarefasService: TarefasService,
    private carregamentoService: CarregamentoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.carregamentoService.setLoading(true);
    this.buscarTarefaspendentes();
  }

  concluirTarefa(id: number) {
    this.carregamentoService.setLoading(true);
    this.tarefasService.concluirTarefa(id).subscribe(
      (resp: Tarefa) => {
        this.toastr.success('Tarefa concluida com sucesso!');
        this.buscarTarefaspendentes();
      },
      (error) => {
        this.carregamentoService.setLoading(false);

        if (error.status === 400) {
          this.toastr.error(
            'Dados inválidos. Por favor, verifique as informações fornecidas.'
          );
        } else if (error.status === 401) {
          this.toastr.error(
            'Não autorizado. Verifique suas credenciais e tente novamente.'
          );
          this.route.navigate(['/']);
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

  buscarTarefaspendentes() {
    this.tarefasService.buscarTarefasPendentes().subscribe(
      (resp: Tarefa[]) => {
        this.carregamentoService.setLoading(false);
        this.tarefas = resp;
      },
      (error) => {
        this.carregamentoService.setLoading(false);
        if (error.status === 400) {
          this.toastr.error(
            'Tivemos um erro para buscar as tarefas pendentes.'
          );
        } else if (error.status === 401) {
          localStorage.removeItem("TOKEN");
          this.toastr.error(
            'Não autorizado. Verifique suas credenciais e tente novamente.'
          );
          this.route.navigate(['/']);
        } else if (error.status === 404) {
          this.toastr.error(
            'Tivemos um erro para buscar as tarefas pendentes. Tente novamente mais tarde.'
          );
        } else if (error.status === 500) {
          this.toastr.error(
            'Erro interno do servidor. Por favor, tente novamente mais tarde.'
          );
        } else {
          localStorage.removeItem("TOKEN");
          this.toastr.error(
            'Ocorreu um erro desconhecido. Por favor, tente novamente.'
          );
          this.route.navigate(['/']);
        }
      }
    );
  }

  getPrioridadeTexto(prioridade: number): string {
    switch (prioridade) {
      case EnumPrioridadeTarefa.Baixa:
        return 'Baixa';
      case EnumPrioridadeTarefa.Media:
        return 'Média';
      case EnumPrioridadeTarefa.Alta:
        return 'Alta';
      default:
        return 'Desconhecida';
    }
  }

  adicionarTarefa() {
    this.route.navigate(['/cadastro-tarefas']);
  }

  sair() {
    localStorage.removeItem('TOKEN');
    this.route.navigate(['/']);
  }
}
