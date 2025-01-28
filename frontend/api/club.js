import { apiVersion, basePath } from './config';

export class ClubAPI {
    baseApi = `${basePath}/${apiVersion}`;
  

    ///// NO LLAMEN ESTA FUNCION POR QUE SE  ROMPE EL PROGRAMA, NO HAY RUTA AUN
    async obtenerClubPorId(clubId) {
        try {
          const url = `${this.baseApi}/club/${clubId}`;
          const response = await fetch(url);
          const result = await response.json();
    
          if (response.status !== 200) throw new Error('Club no encontrado.');
    
          return result;
        } catch (error) {
          console.error('Error al obtener el club:', error);
          throw error;
        }
      }

    async obtenerClubPorEquipoId(equipoId) {
        try {
          const url = `${this.baseApi}/club/equipo/${equipoId}`;
          const response = await fetch(url);
          const result = await response.json();
    
          if (response.status !== 200) throw new Error('No se pudo encontrar el club asociado al equipo.');
    
          return result;
        } catch (error) {
          console.error('Error al obtener el club por equipo:', error);
          throw error;
        }
      }
  }