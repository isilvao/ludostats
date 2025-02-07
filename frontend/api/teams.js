
import { apiVersion, basePath } from './config';




export class TeamsAPI {



    baseApi = `${basePath}/${apiVersion}`;
  
    async obtenerEquipoConRol(equipoId, usuarioId) {
      try {
        const url = `${this.baseApi}/equipo/${equipoId}/usuario/${usuarioId}`;
        const response = await fetch(url);
        const result = await response.json();
  
        if (response.status !== 200) throw result;
  
        return result; // 📌 Ahora solo devuelve los datos, sin usar hooks aquí
      } catch (error) {
        console.error("❌ Error obteniendo equipo:", error);
        throw error;
      }
    }
  
    async obtenerClubConRol(clubId, usuarioId) {
      try {
        const url = `${this.baseApi}/club/${clubId}/usuario/${usuarioId}`;
        const response = await fetch(url);
        const result = await response.json();
  
        if (response.status !== 200) throw result;
  
        return result; // 📌 Ahora solo devuelve los datos, sin usar hooks aquí
      } catch (error) {
        console.error("❌ Error obteniendo club:", error);
        throw error;
      }
    }
  }
  