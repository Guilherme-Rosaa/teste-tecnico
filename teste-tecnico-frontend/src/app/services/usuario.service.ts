import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUsuario } from '../models/login-usuario.model';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  rota = "http://localhost:3001/api/usuario/"

  login(login: LoginUsuario): Observable<Token> {
    return this.http.post<Token>(`${this.rota}Login`, login);
  }

  cadastrar(cadastro: any): Observable<any> {
    return this.http.post(`${this.rota}Cadastrar`, cadastro);
  }

}
