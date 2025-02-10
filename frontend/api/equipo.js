import { basePath, apiVersion } from './config';
import jwtDecode from 'jwt-decode';
export class EquipoAPI {
  baseApi = `${basePath}/${apiVersion}`;

  async obtenerEquipoPorId(equipoId, accessToken) {
    try {
      const params = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const url = `${this.baseApi}/equipo/${equipoId}`;
      const response = await fetch(url, params);
      const result = await response.json();
      // console.log('📌 Equipo encontrado:', result);
      if (response.status !== 200)
        throw new Error('Equipo no encontrado. jeje');

      return result;
    } catch (error) {
      console.error('Error al obtener el equipo:', error);
      throw error;
    }
  }

  async crearEquipo(equipo, accessToken) {
    baseApi = `${basePath}/${apiVersion}`;

    try {
      const url = `${this.baseApi}/nuevoequipo`;

      const params = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(equipo),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      console.error('Error al crear el equipo:', error);
    }
  }

  async modificarEquipo(equipo, accessToken) {
    try {
      const url = `${this.baseApi}/patchequipo/${equipo.id}`;

      const params = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(equipo),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      console.error('Error al modificar el equipo:', error);
      throw error;
    }
  }

  async eliminarEquipo(equipoId, accessToken) {
    try {
      const url = `${this.baseApi}/eliminarequipo/${equipoId}`;

      const params = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      console.error('Error al eliminar el equipo:', error);
      throw error;
    }
  }

  async obtenerMisEquipos(userId) {
    try {
      // 📌 Pasamos `userId` como query param en la URL
      const url = `${this.baseApi}/misequipos?user_id=${userId}`;

      const params = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      console.error('Error al obtener mis equipos:', error);
      throw error;
    }
  }

  async actualizarLogoEquipo(equipoId, file) {
    try {
      const url = `${this.baseApi}/equipo_logo/${equipoId}`;
      const formData = new FormData();
      formData.append('logo', file);

      const params = {
        method: 'PATCH',
        body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getUsersByTeam(equipoId) {
    try {
      const url = `${this.baseApi}/equipo/users/${equipoId}`;
      const params = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      console.error('Error al obtener los usuarios del equipo:', error);
      throw error;
    }
  }
}
