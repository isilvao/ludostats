import { apiVersion, basePath } from '../utils/config';

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



  //////////////////////////////////////////////////
  //////////////////////////////////////////////
  //TRANSACIONES API/////////////////////////////

  async crearTransaccion(data) {
    try {
      const url = `${this.baseApi}/crear-transaccion`;
      const params = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 201) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 📌 Obtener transacciones por usuario ID
  async obtenerTransaccionesPorUsuario(usuarioId) {
    try {
      const url = `${this.baseApi}/transacciones/${usuarioId}`;
      const response = await fetch(url);
      const result = await response.json();

      if (response.status !== 200) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////////////////////////////
  //////////////////////////////////////////////
  //COMPRAR MEMBRESIA/////////////////////////////

  // 📌 Comprar membresía
  async comprarMembresia(data) {
    try {
      const url = `${this.baseApi}/comprar-membresia`;
      const params = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 📌 Comprar matrícula
  async comprarMatricula(data) {
    try {
      const url = `${this.baseApi}/comprar-matricula`;
      const params = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////////////////////////////
  //////////////////////////////////////////////
  //PAGAR MEMBRESIA Y MATRICULA/////////////////////////////

  // 📌 Pagar membresía
  async pagarMembresia(data) {
    try {
      const url = `${this.baseApi}/pagar-membresia`;
      const params = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 📌 Pagar matrícula
  async pagarMatricula(data) {
    try {
      const url = `${this.baseApi}/pagar-matricula`;
      const params = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  }


  /////////////////////////////
  ////////NOTIFICACIONES


  async obtenerNotificaciones(usuario_id) {
    try {
      const url = `${this.baseApi}/misNotificaciones/${usuario_id}`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async marcarNotificacionLeida(notificacion_id) {
    try {
      const url = `${this.baseApi}/notificacion/${notificacion_id}/leida`;
      const params = {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" }
      };

      const response = await fetch(url, params);
      return await response.json();
    } catch (error) {
      throw error;
    }
  }


  ////////////EVENTOS DEPENDENCIAS
  async crearEvento(eventoData) {
    try {
      const url = `${this.baseApi}/evento`;

      const params = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventoData),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      // if (response.status !== 200) throw new Error('Error al crear el evento.');

      return result;
    } catch (error) {
      console.error('Error al crear el evento:', error);
      throw error;
    }
  }

  // 📌 Obtener eventos por club
  async obtenerEventosPorClub(clubId) {
    try {
      const url = `${this.baseApi}/eventos/club/${clubId}`;
      const response = await fetch(url);
      const result = await response.json();

      if (response.status !== 200) throw new Error('No se pudieron obtener los eventos del club.');

      return result;
    } catch (error) {
      console.error('Error al obtener eventos del club:', error);
      throw error;
    }
  }

  // 📌 Obtener eventos por equipo
  async obtenerEventosPorEquipo(equipoId) {
    try {
      const url = `${this.baseApi}/eventos/equipo/${equipoId}`;
      const response = await fetch(url);
      const result = await response.json();

      if (response.status !== 200) throw new Error('No se pudieron obtener los eventos del equipo.');

      return result;
    } catch (error) {
      console.error('Error al obtener eventos del equipo:', error);
      throw error;
    }
  }



  //////////////////
  //////otra de eventos

  async obtenerEventosCercanosPorClub(clubId) {
    try {
        const url = `${this.baseApi}/eventos/club/cercanos/${clubId}`;
        const response = await fetch(url);
        const result = await response.json();

        if (response.status !== 200) throw new Error('No se encontraron eventos.');

        return result;
    } catch (error) {
        console.error('Error al obtener eventos cercanos del club:', error);
        throw error;
    }
}

async obtenerEventosCercanosPorEquipo(equipoId) {
  try {
      const url = `${this.baseApi}/eventos/equipo/cercanos/${equipoId}`;
      const response = await fetch(url);
      const result = await response.json();

      if (response.status !== 200) throw new Error('No se encontraron eventos.');

      return result;
  } catch (error) {
      console.error('Error al obtener eventos cercanos del equipo:', error);
      throw error;
  }
}


/////////
///galerias


async subirImagenGaleria(titulo, descripcion, club_id, equipo_id, file) {
  try {
      const url = `${this.baseApi}/galeria`;
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('descripcion', descripcion);
      if (club_id) formData.append('club_id', club_id);
      if (equipo_id) formData.append('equipo_id', equipo_id);
      formData.append('imagen', file);

      const params = {
          method: 'POST',
          body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (!response.ok) throw result;
      return result;

  } catch (error) {
      console.error('Error al subir imagen a la galería:', error);
      throw error;
  }
}

// 📌 Obtener imágenes de la galería por Club ID
async obtenerGaleriaPorClub(club_id) {
  try {
      const url = `${this.baseApi}/galeria/club/${club_id}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener la galería del club.');
      return await response.json();
  } catch (error) {
      console.error('Error al obtener la galería del club:', error);
      throw error;
  }
}

// 📌 Obtener imágenes de la galería por Equipo ID
async obtenerGaleriaPorEquipo(equipo_id) {
  try {
      const url = `${this.baseApi}/galeria/equipo/${equipo_id}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener la galería del equipo.');
      return await response.json();
  } catch (error) {
      console.error('Error al obtener la galería del equipo:', error);
      throw error;
  }
}




}
