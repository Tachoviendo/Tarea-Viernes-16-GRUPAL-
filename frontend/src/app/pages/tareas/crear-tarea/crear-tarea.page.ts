import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { TareaCard } from '../../../components/tarea-card/tarea-card';
import { Tarea, TareaDto } from '../../../model/tarea';
import { TareaService } from '../../../services/tarea.service';

@Component({
  imports: [TareaCard, RouterLink],
  selector: 'app-crear-tarea',
  styleUrl: './crear-tarea.page.css',
  templateUrl: './crear-tarea.page.html',
})
export class CrearTareaPage {
  private readonly tareaService = inject(TareaService);
  private readonly router = inject(Router);

  // La card necesita una tarea, así que al crear se le pasa una vacía
  // id_tarea, creada y estado los pone el service al guardar
  protected readonly nuevaTarea: Tarea = {
    id_tarea: 0,
    // Sin login en el front, las nuevas quedan creadas por el usuario 1 como en el seed
    id_creador: 1,
    grupo: 'user',
    titulo: '',
    descripcion: '',
    prioridad: '1:media',
    creada: '',
    terminada: null,
    estado: 'Abierta',
  };

  protected async crear(dto: TareaDto) {
    await this.tareaService.crear(dto);
    this.router.navigate(['/tareas']);
  }
}
