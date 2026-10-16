import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { UsuarioForm } from '../../../components/usuario-form/usuario-form';
import { UsuarioDto } from '../../../model/usuario';
import { ErroresService } from '../../../services/errores.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  imports: [UsuarioForm, RouterLink],
  selector: 'app-crear-usuario',
  styleUrl: './crear-usuario.page.css',
  templateUrl: './crear-usuario.page.html',
})
export class CrearUsuarioPage {
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly erroresService = inject(ErroresService);

  // El form necesita un usuario, así que al crear se le pasa uno vacío
  protected readonly nuevoUsuario: UsuarioDto = {
    username: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    password: '',
    grupos: ['user'],
    activo: true,
  };

  protected async crear(dto: UsuarioDto) {
    try {
      await this.usuarioService.crear(dto);
      this.router.navigate(['/usuarios']);
    } catch (error) {
      //Ej: username repetido. Se muestra arriba en app.html y se queda en el form
      this.erroresService.agregar(this.erroresService.obtenerMensaje(error));
    }
  }
}
