import { Component, inject, input, resource } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { UsuarioForm } from '../../../components/usuario-form/usuario-form';
import { UsuarioDto } from '../../../model/usuario';
import { ErroresService } from '../../../services/errores.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  imports: [UsuarioForm, RouterLink],
  selector: 'app-editar-usuario',
  styleUrl: './editar-usuario.page.css',
  templateUrl: './editar-usuario.page.html',
})
export class EditarUsuarioPage {
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly erroresService = inject(ErroresService);

  // Viene del :id_usuario de la ruta (withComponentInputBinding en app.config)
  readonly idUsuario = input.required<string>({ alias: 'id_usuario' });

  protected readonly usuario = resource({
    params: () => ({ id: Number(this.idUsuario()) }),
    loader: async ({ params }) => {
      try {
        return await this.usuarioService.obtenerPorId(params.id);
      } catch (error) {
        this.erroresService.agregar(this.erroresService.obtenerMensaje(error));
        throw error;
      }
    },
  });

  protected async actualizar(dto: UsuarioDto) {
    const usuarioActualizar = {
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      fecha_nacimiento: dto.fecha_nacimiento,
      grupos: dto.grupos,
      activo: dto.activo,
    };

    try {
      await this.usuarioService.actualizar(Number(this.idUsuario()), usuarioActualizar);

      this.router.navigate(['/usuarios']);
    } catch (error) {
      this.erroresService.agregar(this.erroresService.obtenerMensaje(error));
    }
  }
}
