import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Tarefa } from '../models/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefasService {

  constructor(private http: HttpClient) { }

  rota = "http://localhost:3001/api/tarefa/"

  buscarTarefasPendentes() : Observable<Tarefa[]>{
    return this.http.get<Tarefa[]>(`${this.rota}BuscarTarefasPendentes`, {headers:this.addHeader()})
  }
  concluirTarefa(id:number) : Observable<Tarefa>{
    return this.http.post<Tarefa>(`${this.rota}Concluir/${id}`,{}, {headers:this.addHeader()})
  }

  cadastrarTarefa(tarefa: any): Observable<Tarefa> {
    return this.http.post<Tarefa>(`${this.rota}CadastrarTarefa`, tarefa, { headers: this.addHeader() });
  }

  private addHeader(): HttpHeaders {
    let defaultHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    let token = localStorage.getItem("TOKEN")

    if (token) {
      defaultHeaders = defaultHeaders.set('Authorization', `Bearer ${token}`);
    } else {
      console.error('Token não encontrado. Não foi possível adicionar o cabeçalho de autorização.');
    }
    return defaultHeaders;
  }
}
