import { JsonPipe } from '@angular/common';
import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';

import { Grupo, UsuarioDto } from '../../model/usuario';

@Component({
  imports: [FormField, JsonPipe],
  selector: 'app-usuario-form',
  styleUrl: './usuario-form.css',
  templateUrl: './usuario-form.html',
})
export class UsuarioForm {
  //Parámetro para <app-usuario-form>
  public usuario = input.required<UsuarioDto>();
  public guardar = output<UsuarioDto>();


  public usuarioModel = linkedSignal<Required<UsuarioDto>>(() => {
    const usuario = this.usuario();

    let password = '';
    if (usuario.password !== undefined) {
      password = usuario.password;
    }

    return {
      username: usuario.username,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      fecha_nacimiento: usuario.fecha_nacimiento,
      grupos: usuario.grupos,
      activo: usuario.activo,
      password: password,
    };
  });

  //Solo el usuario nuevo trae password: la api no deja cambiarla al editar
  public esNuevo = computed(() => this.usuario().password !== undefined);

  public usuarioForm = form(this.usuarioModel, (schemaPath) => {
    required(schemaPath.username, { message: 'El username es obligatorio' });
    minLength(schemaPath.username, 3, {
      message: 'El largo mínimo para el usuario es 3 caracteres.',
    });

    required(schemaPath.nombres, { message: 'Los nombres son obligatorios' });
    required(schemaPath.apellidos, { message: 'Los apellidos son obligatorios' });

    validate(schemaPath.grupos, ({ value }) => {
      if (value().length === 0) {
        return { kind: 'sinGrupo', message: 'Elegí al menos un grupo.' };
      }
      return undefined;
    });
  });

  //Los grupos son un array, así que los checkboxes se manejan a mano
  public cambiarGrupo(grupo: Grupo, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const gruposActuales = this.usuarioForm.grupos().value();

    let gruposNuevos: Grupo[];
    if (checkbox.checked) {
      //concat devuelve un array nuevo con el grupo agregado al final
      gruposNuevos = gruposActuales.concat(grupo);
    } else {
      //filter devuelve un array nuevo sin ese grupo
      gruposNuevos = gruposActuales.filter((g) => g !== grupo);
    }

    //Se cambia solo el campo grupos del form
    this.usuarioForm.grupos().value.set(gruposNuevos);
  }

  public submitForm(event: Event) {
    event.preventDefault();
    //submit solo ejecuta la función si el form es válido
    submit(this.usuarioForm, async () => {
      const modelo = this.usuarioModel();

      const usuario: UsuarioDto = {
        username: modelo.username,
        nombres: modelo.nombres,
        apellidos: modelo.apellidos,
        fecha_nacimiento: modelo.fecha_nacimiento,
        grupos: modelo.grupos,
        activo: modelo.activo,
      };

      //La password solo se manda al crear
      if (this.esNuevo()) {
        usuario.password = modelo.password;
      }

      this.guardar.emit(usuario);
    });
  }
}
