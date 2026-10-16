import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ActualizarUsuarioDto, Usuario, UsuarioDto } from '../model/usuario';
import { environment } from '../../environments/environment';

@Service()
export class UsuarioService {
  // Mismos datos que el seed de api/db/00.sql

  //ESTO ES NUEVO
  //aca tamo haciendo la url base
  private baseUrl = environment.apiUrl + '/usuarios';

  // inyectar el servicio.
  private _httpClient = inject(HttpClient);

  // Los métodos son async para que la página los use igual que cuando sea la api

  async obtenerTodos(): Promise<Usuario[]> {
    //aca hay un observable? que con el firstValueFrom pasa a ser una promesa que se resuelve con el valor del observable.
    return await firstValueFrom(this._httpClient.get<Usuario[]>(this.baseUrl));
  }

  async obtenerPorId(idUsuario: number): Promise<Usuario | undefined> {
    return await firstValueFrom(this._httpClient.get<Usuario>(`${this.baseUrl}/${idUsuario}`));
  }

  async crear(dto: UsuarioDto): Promise<Usuario> {
    return await firstValueFrom(this._httpClient.post<Usuario>(this.baseUrl, dto));
  }

  async actualizar(idUsuario: number, dto: ActualizarUsuarioDto): Promise<Usuario> {
    return await firstValueFrom(
      this._httpClient.patch<Usuario>(`${this.baseUrl}/${idUsuario}`, dto),
    );
  }

  async eliminar(idUsuario: number): Promise<void> {
    return await firstValueFrom(
      this._httpClient.delete<void>(`${this.baseUrl}/${idUsuario}`),
    );
  }
}
