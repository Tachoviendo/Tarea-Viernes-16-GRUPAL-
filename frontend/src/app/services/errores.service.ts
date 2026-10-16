import { Service, signal } from '@angular/core';

//Errores que no son de un campo del form (api caída, base caída, etc.)
@Service()
export class ErroresService {
  public errores = signal<string[]>([]);

  public agregar(mensaje: string) {
    //update devuelve un array nuevo con el mensaje agregado al final
    this.errores.update((errores) => errores.concat(mensaje));
  }

  public vaciar() {
    this.errores.set([]);
  }

  //Saca el mensaje del error que tira firstValueFrom
  public obtenerMensaje(error: any): string {
    //Error de la api: el mensaje viene en el body
    if (error?.error?.message) {
      return error.error.message;
    }
    //Api caída: no hay body, el mensaje lo pone Angular
    if (error?.message) {
      return error.message;
    }
    return 'Ocurrió un error inesperado.';
  }
}
