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
      console.error('❌ Error obteniendo equipo:', error);
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
      console.error('❌ Error obteniendo club:', error);
      throw error;
    }
  }

  // APIs para los eventos porque no podemos crear otro archivo
  async createEvento(evento, id_club) {
    try {
      const url = `${this.baseApi}/nuevoevento/${id_club}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evento),
      });
      const result = await response.json();

      if (response.status !== 201) throw result;

      return result;
    } catch (error) {
      console.error('❌ Error creando evento:', error);
      throw error;
    }
  }

  async updateEvento(evento) {
    try {
      const url = `${this.baseApi}/updateevento/${evento.id}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evento),
      });
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      console.error('❌ Error actualizando evento:', error);
      throw error;
    }
  }

  async deleteEvento(eventoId) {
    try {
      const url = `${this.baseApi}/deleteevento/${eventoId}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      console.error('❌ Error eliminando evento:', error);
      throw error;
    }
  }

  async getEventosClub(clubId) {
    try {
      const url = `${this.baseApi}/eventos/${clubId}`;
      const response = await fetch(url);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      console.error('❌ Error obteniendo eventos del club:', error);
      throw error;
    }
  }

}
