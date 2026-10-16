import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Tarea, TareaDto } from '../model/tarea';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private readonly baseUrl = environment.apiUrl + '/tareas';
  private readonly httpClient = inject(HttpClient);

  async obtenerTodas(): Promise<Tarea[]> {
    return await firstValueFrom(this.httpClient.get<Tarea[]>(this.baseUrl));
  }

  async obtenerPorId(idTarea: number): Promise<Tarea | undefined> {
    return await firstValueFrom(this.httpClient.get<Tarea>(`${this.baseUrl}/${idTarea}`));
  }

  async crear(dto: TareaDto): Promise<Tarea> {
    const nuevaTarea = {
      id_creador: dto.id_creador,
      grupo: dto.grupo,
      titulo: dto.titulo,
      descripcion: dto.descripcion ?? undefined,
      prioridad: dto.prioridad,
    };

    return await firstValueFrom(this.httpClient.post<Tarea>(this.baseUrl, nuevaTarea));
  }

  async actualizar(idTarea: number, dto: TareaDto): Promise<Tarea> {
    const tareaActualizada = {
      titulo: dto.titulo,
      descripcion: dto.descripcion ?? '',
      grupo: dto.grupo,
      prioridad: dto.prioridad,
    };

    let tarea = await firstValueFrom(
      this.httpClient.patch<Tarea>(`${this.baseUrl}/${idTarea}`, tareaActualizada),
    );

    if (dto.terminada !== null) {
      tarea = await this.finalizar(idTarea, dto.terminada);
    }

    return tarea;
  }

  async finalizar(idTarea: number, fecha: string): Promise<Tarea> {
    return await firstValueFrom(
      this.httpClient.patch<Tarea>(`${this.baseUrl}/${idTarea}/finalizar`, { fecha }),
    );
  }

  async eliminar(idTarea: number): Promise<void> {
    await firstValueFrom(this.httpClient.delete<void>(`${this.baseUrl}/${idTarea}`));
  }
}
