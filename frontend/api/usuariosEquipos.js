import { apiVersion, basePath } from './config';
export class UsuariosEquiposAPI {
  baseApi = `${basePath}/${apiVersion}`;

  async crearUsuarioEquipo(usuarioId, equipoId, rol) {
    try {
      const url = `${this.baseApi}/usuarios-equipos`;
      const params = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          equipo_id: equipoId,
          rol,
        }),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 201)
        throw new Error(result.msg || 'Error al crear el registro.');

      return result;
    } catch (error) {
      console.error('Error al crear el registro en UsuariosEquipos:', error);
      throw error;
    }
  }
}
