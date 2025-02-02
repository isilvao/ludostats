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

      async crearClub(club, accessToken){
        try {
          const url = `${this.baseApi}/newclub`;

          const params = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(club),
          }

          const response = await fetch(url, params);
          const result = await response.json();

          if (response.status !== 201) throw result;

          return result;
        } catch (error) {
          console.error('Error al crear el club:', error);
          throw error;
        }
      }

      async editarClub(club, accessToken){
        try {
          const url = `${this.baseApi}/updateclub/${club.id}`;

          const params = {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(club),
          }

          const response = await fetch(url, params);
          const result = await response.json();

          if (response.status !== 200) throw result;

          return result;
        } catch (error) {
          console.error('Error al editar el club:', error);
          throw error;
        }
      }

      async eliminarClub(clubId, accessToken){
        try {
          const url = `${this.baseApi}/deleteclub/${clubId}`;

          const params = {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }

          const response = await fetch(url, params);
          const result = await response.json();

          if (response.status !== 200) throw result;

          return result;
        } catch (error) {
          console.error('Error al eliminar el club:', error);
          throw error;
        }
      }

      async buscarMisClubes(accessToken){
        try {
          const url = `${this.baseApi}/misclubes`;

          const params = {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }

          const response = await fetch(url, params);
          const result = await response.json();

          if (response.status !== 200) throw new Error('No se pudo encontrar el club asociado al equipo.');

            return result;
        } catch (error) {
          console.error('Error al buscar mis clubes:', error);
          throw error;
        }
      }
  }