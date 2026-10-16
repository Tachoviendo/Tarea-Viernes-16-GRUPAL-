import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, linkedSignal, output, resource } from '@angular/core';
import { form, FormField, maxLength, required, submit, validate } from '@angular/forms/signals';

import { Tarea, TareaDto } from '../../model/tarea';
import { ErroresService } from '../../services/errores.service';
import { UsuarioService } from '../../services/usuario.service';

const GRUPOS = ['user', 'admin', 'superadmin'];
const PRIORIDADES = ['0:baja', '1:media', '2:alta'];

// La card no guarda con el service: muestra o edita la tarea y avisa a la página con outputs
// Solo usa UsuarioService para cargar las opciones del select de creador
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

  private readonly usuarioService = inject(UsuarioService);
  private readonly erroresService = inject(ErroresService);

  // Con params undefined el resource no carga: así no se pide en cada card de la lista
  public usuarios = resource({
    params: () => (this.editando() ? true : undefined),
    loader: async () => {
      try {
        return await this.usuarioService.obtenerTodos();
      } catch (error) {
        this.erroresService.agregar(this.erroresService.obtenerMensaje(error));
        throw error;
      }
    },
  });

  // La página de crear le pasa una tarea con id_tarea 0
  public esNueva = computed(() => this.tarea().id_tarea === 0);

  // La api no permite des-terminar una tarea
  public yaTerminada = computed(() => this.tarea().terminada !== null);

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

    validate(schemaPath.grupo, ({ value }) => {
      if (!GRUPOS.includes(value())) {
        return { kind: 'grupoInvalido', message: 'Elegí un grupo válido.' };
      }
      return null;
    });

    validate(schemaPath.prioridad, ({ value }) => {
      if (!PRIORIDADES.includes(value())) {
        return { kind: 'prioridadInvalida', message: 'Elegí una prioridad válida.' };
      }
      return null;
    });

    validate(schemaPath.id_creador, ({ value }) => {
      if (!Number.isInteger(value()) || value() < 1) {
        return { kind: 'sinCreador', message: 'Elegí un creador.' };
      }
      return null;
    });
  });

  // '2:alta' -> 'alta'
  public prioridadTexto(prioridad: string) {
    return prioridad.split(':')[1];
  }

  //El select da un string y id_creador es un número, así que se maneja a mano
  public cambiarCreador(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.tareaForm.id_creador().value.set(Number(select.value));
  }

  //terminada es una fecha o null, así que el checkbox se maneja a mano
  //Si ya estaba terminada el checkbox está deshabilitado, así que acá siempre era null
  public cambiarTerminada(event: Event) {
    const checkbox = event.target as HTMLInputElement;

    let terminada: string | null = null;
    if (checkbox.checked) {
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