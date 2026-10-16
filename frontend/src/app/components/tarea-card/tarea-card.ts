import { DatePipe } from '@angular/common';
import { Component, input, linkedSignal, output } from '@angular/core';
import { form, FormField, maxLength, required, submit } from '@angular/forms/signals';

import { Tarea, TareaDto } from '../../model/tarea';

// La card no usa el service: muestra o edita la tarea y avisa a la página con outputs
@Component({
  imports: [DatePipe, FormField],
  selector: 'app-tarea-card',
  styleUrl: './tarea-card.css',
  templateUrl: './tarea-card.html',
})
export class TareaCard {
  //Parámetros para <app-tarea-card>
  public tarea = input.required<Tarea>();
  public editando = input(false);

  public editar = output<number>();
  public eliminar = output<number>();
  public guardar = output<TareaDto>();

  //LinkedSignal para que su valor dependa de la otra señal, y a la vez sea editable
  public tareaModel = linkedSignal(() => {
    const tarea = this.tarea();

    //descripcion puede venir null, y el textarea necesita un string
    let descripcion = '';
    if (tarea.descripcion !== null) {
      descripcion = tarea.descripcion;
    }

    return {
      id_creador: tarea.id_creador,
      titulo: tarea.titulo,
      descripcion: descripcion,
      grupo: tarea.grupo,
      prioridad: tarea.prioridad,
      terminada: tarea.terminada,
    };
  });

  public tareaForm = form(this.tareaModel, (schemaPath) => {
    required(schemaPath.titulo, { message: 'El título es obligatorio' });
    maxLength(schemaPath.titulo, 100, { message: 'El largo máximo del título es 100 caracteres.' });
  });

  // '2:alta' -> 'alta'
  public prioridadTexto(prioridad: string) {
    return prioridad.split(':')[1];
  }

  //terminada es una fecha o null, así que el checkbox se maneja a mano
  public cambiarTerminada(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const fechaOriginal = this.tarea().terminada;

    let terminada: string | null;
    if (!checkbox.checked) {
      terminada = null;
    } else if (fechaOriginal !== null) {
      //Si ya estaba terminada se mantiene la fecha original
      terminada = fechaOriginal;
    } else {
      terminada = new Date().toISOString();
    }

    //Se cambia solo el campo terminada del form
    this.tareaForm.terminada().value.set(terminada);
  }

  public submitForm(event: Event) {
    event.preventDefault();
    //submit solo ejecuta la función si el form es válido
    submit(this.tareaForm, async () => {
      const modelo = this.tareaModel();

      //Si la descripción quedó vacía se manda null, como en la base
      let descripcion: string | null = modelo.descripcion;
      if (descripcion === '') {
        descripcion = null;
      }

      this.guardar.emit({
        id_creador: modelo.id_creador,
        titulo: modelo.titulo,
        descripcion: descripcion,
        grupo: modelo.grupo,
        prioridad: modelo.prioridad,
        terminada: modelo.terminada,
      });
    });
  }
}
