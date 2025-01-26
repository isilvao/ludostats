import { apiVersion, basePath } from './config';

export class InvitacionesAPI {
  baseApi = `${basePath}/${apiVersion}`;

  // Convertir rol de string a número
  getRolNumber(rol) {
    switch (rol.toLowerCase()) {
      case 'deportista':
        return 0;
      case 'profesor':
        return 1;
      case 'acudiente':
        return 2;
      default:
        throw new Error('Rol no válido');
    }
  }

  // Acortar UUID para la URL (ejemplo base64)
  encodeUUID(uuid) {
    return btoa(uuid).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  // Decodificar el UUID cuando se recibe la versión corta
  decodeUUID(encoded) {
    return atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
  }

  // 1. Crear invitación (POST)
  async crearInvitacion(clubId, rolStr, creatorId, extraId = null) {
    try {
      const rolNumerico = this.getRolNumber(rolStr);
      
      // Calcular la fecha de expiración (hoy + 1 día)
      const fechaExp = new Date();
      fechaExp.setDate(fechaExp.getDate() + 1);

      const url = `${this.baseApi}/invitaciones`;
      const params = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          club_id: clubId,
          rol_invitado: rolNumerico,
          usado: false,
          fecha_exp: fechaExp.toISOString(),
          creator_id: creatorId,
          extra_id: extraId,
        }),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 201) throw result;

      // Acortar el UUID para la URL
      const shortId = this.encodeUUID(result.id);

      return `https://www.ludostats.com/unirse/${shortId}`;
    } catch (error) {
      throw new Error('Error al crear la invitación.');
    }
  }

  // 2. Verificar invitación por ID (GET)
  async verificarInvitacion(encodedId) {
    try {
      const uuid = this.decodeUUID(encodedId);
      const url = `${this.baseApi}/invitaciones/${uuid}`;
      const response = await fetch(url);
      const result = await response.json();

      if (response.status !== 200) throw new Error('Invitación no encontrada.');

      return result;
    } catch (error) {
      throw new Error('Error al verificar la invitación.');
    }
  }

  // 3. Marcar invitación como usada (PATCH)
  async marcarInvitacionUsada(encodedId) {
    try {
      const uuid = this.decodeUUID(encodedId);
      const url = `${this.baseApi}/invitaciones/${uuid}/usar`;

      const params = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200)
        throw new Error('Error al marcar la invitación como usada.');

      return result;
    } catch (error) {
      throw new Error('Error al marcar la invitación como usada.');
    }
  }

  // 4. Eliminar invitación (DELETE)
  async eliminarInvitacion(encodedId) {
    try {
      const uuid = this.decodeUUID(encodedId);
      const url = `${this.baseApi}/invitaciones/${uuid}`;

      const params = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200)
        throw new Error('Error al eliminar la invitación.');

      return result;
    } catch (error) {
      throw new Error('Error al eliminar la invitación.');
    }
  }
}
