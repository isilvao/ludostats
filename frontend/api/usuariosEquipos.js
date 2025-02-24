import { apiVersion, basePath } from '../utils/config';

export class UsuariosEquipos {
  baseApi = `${basePath}/${apiVersion}`;

  /**
   * 📌 Agregar usuario a un equipo (incluye lógica de padres e hijos).
   * @param {string} usuarioId - ID del usuario.
   * @param {string} equipoId - ID del equipo.
   * @param {number} rol - Rol del usuario en el equipo (1=Deportista, 2=Acudiente, 3=Profesor, 4=Administrador, 5=Hijo).
   * @param {Object} hijoDatos - Si el usuario es acudiente, contiene `{ nombre, apellido }` del hijo.
   * @returns {Promise} - Respuesta del backend.
   */

  async agregarUsuarioEquipo(usuarioId, equipoId, rol, hijoDatos = null) {
    try {
      const url = `${this.baseApi}/usuarios-equipos`;

      let nuevoRol = rol;

      const body = {
        usuario_id: usuarioId,
        equipo_id: equipoId,
        rol: nuevoRol,
      };

      // 📌 Si el usuario es padre (2), incluir datos del hijo
      if (rol === 2 && hijoDatos) {
        body.nombre = hijoDatos.nombre;
        body.apellido = hijoDatos.apellido;
      }

      const params = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 201)
        throw new Error(result.msg || 'Error al agregar usuario al equipo.');

      console.log('📌 Usuario agregado correctamente:', result);

      return result;
    } catch (error) {
      console.error('❌ Error al agregar usuario al equipo:', error);
      throw error;
    }
  }

  /**
   * 📌 Eliminar un usuario de un equipo.
   * @param {string} usuarioId - ID del usuario a eliminar.
   * @param {string} equipoId - ID del equipo.
   * @returns {Promise} - Respuesta del backend.
   */
  async eliminarUsuarioEquipo(usuarioId, equipoId) {
    try {
      const url = `${this.baseApi}/usuarios-equipos/${usuarioId}/${equipoId}`;

      const params = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200)
        throw new Error(result.msg || 'Error al eliminar usuario del equipo.');

      console.log('📌 Usuario eliminado correctamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al eliminar usuario del equipo:', error);
      throw error;
    }
  }

  /**
   * 📌 Obtener todos los equipos de un usuario.
   * @param {string} usuarioId - ID del usuario.
   * @returns {Promise} - Lista de equipos donde está registrado el usuario.
   */
  async obtenerEquiposDeUsuario(usuarioId) {
    try {
      const url = `${this.baseApi}/usuarios-equipos/${usuarioId}/equipos`;

      const response = await fetch(url);
      const result = await response.json();

      if (response.status !== 200)
        throw new Error(
          result.msg || 'Error al obtener los equipos del usuario.'
        );

      console.log('📌 Equipos del usuario obtenidos:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al obtener equipos del usuario:', error);
      throw error;
    }
  }

  /**
   * 📌 Obtener todos los clubes de un usuario (a partir de los equipos en los que está registrado).
   * @param {string} usuarioId - ID del usuario.
   * @returns {Promise} - Lista de clubes en los que participa el usuario.
   */
  async obtenerClubesDeUsuario(usuarioId) {
    try {
      const url = `${this.baseApi}/usuarios-equipos/${usuarioId}/clubes`;

      const response = await fetch(url);
      const result = await response.json();

      if (response.status !== 200)
        throw new Error(
          result.msg || 'Error al obtener los clubes del usuario.'
        );

      return result;
    } catch (error) {
      console.error('❌ Error al obtener clubes del usuario:', error);
      throw error;
    }
  }

  async modificarRolUsuarioEquipo(usuarioId, equipoId, nuevoRol) {
    try {
      const url = `${this.baseApi}/usuario_equipo/rol/${usuarioId}/${equipoId}`;

      const params = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nuevo_rol: nuevoRol }) // 📌 Ahora enviamos un string
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async modificarRolUsuarioClub(usuarioId, clubId, nuevoRol) {
    try {
      const url = `${this.baseApi}/usuarioclub/rol/${usuarioId}/${clubId}`;

      const params = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nuevo_rol: nuevoRol }) // 📌 Ahora enviamos un string
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }
}
