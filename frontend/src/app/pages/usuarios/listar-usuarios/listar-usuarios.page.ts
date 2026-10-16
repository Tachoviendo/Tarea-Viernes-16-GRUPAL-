import { Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ErroresService } from '../../../services/errores.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  imports: [RouterLink],
  selector: 'app-listar-usuarios',
  styleUrl: './listar-usuarios.page.css',
  templateUrl: './listar-usuarios.page.html',
})
export class ListarUsuariosPage {
  private readonly usuarioService = inject(UsuarioService);
  private readonly erroresService = inject(ErroresService);

  protected readonly usuarios = resource({
    loader: async () => {
      try {
        return await this.usuarioService.obtenerTodos();
      } catch (error) {
        //Se muestra arriba en app.html y se vuelve a tirar para que el resource quede en error
        this.erroresService.agregar(this.erroresService.obtenerMensaje(error));
        throw error;
      }
    },
  });

  protected async borrar(idUsuario: number) {
    if (!confirm('¿Borrar este usuario?')) return;
    await this.usuarioService.eliminar(idUsuario);
    this.usuarios.reload();
  }
}
