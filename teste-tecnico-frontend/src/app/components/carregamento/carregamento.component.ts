import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarregamentoService } from '../../services/carregamento.service';

@Component({
  selector: 'app-carregamento',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './carregamento.component.html',
  styleUrl: './carregamento.component.css'
})
export class CarregamentoComponent {
  carregando: boolean = false;

  constructor(private carregamentoService: CarregamentoService) {
    this.carregamentoService.getIsLoading().subscribe((isLoading: boolean) => {
      this.carregando = isLoading;
    });
  }
}
