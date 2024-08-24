import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { CadastroComponent } from './paginas/cadastro/cadastro.component';
import { CadastroTarefasComponent } from './paginas/cadastro-tarefas/cadastro-tarefas.component';
import { TarefasComponent } from './paginas/tarefas/tarefas.component';
import { AutenticacaoGuard } from './guards/autenticacao.guard';

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'cadastro', component: CadastroComponent},
  {path: 'cadastro-tarefas', component: CadastroTarefasComponent, canActivate: [AutenticacaoGuard]},
  {path: 'tarefas', component: TarefasComponent, canActivate: [AutenticacaoGuard]},
];
