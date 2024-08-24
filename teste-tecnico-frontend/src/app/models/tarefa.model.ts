import { EnumPrioridadeTarefa } from './enums/prioridade-enum';

export interface Tarefa {
  id: number;
  tarefa: string;
  prioridade: EnumPrioridadeTarefa;
}
