import { apiVersion, basePath } from './config';

export class InvitacionesAPI {
  baseApi = `${basePath}/${apiVersion}`;

  // Función para generar una clave aleatoria de 6 caracteres
  generarClaveAleatoria() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let clave = '';
    for (let i = 0; i < 6; i++) {
      clave += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return clave;
  }

  // Crear una invitación enviando la clave generada al backend
  async crearInvitacion(equipoId, rolStr, creatorId, extraId = null) {
    try {
      const rolNumerico = this.getRolNumber(rolStr);

      // Generar la clave aleatoria en el frontend
      const claveGenerada = this.generarClaveAleatoria();

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
          equipo_id: equipoId,
          rol_invitado: rolNumerico,
          usado: false,
          fecha_exp: fechaExp.toISOString(),
          creator_id: creatorId,
          extra_id: extraId,
          clave: claveGenerada,
        }),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 201) throw result;

      // Retornar la URL con la clave generada
      console.log(`https://www.ludostats.com/unirse/${claveGenerada}`)
      return `https://www.ludostats.com/unirse/${claveGenerada}`;
    } catch (error) {
      throw new Error('Error al crear la invitación.');
    }
  }

  // Obtener invitación por clave
  async verificarInvitacion(clave) {
    try {
      const url = `${this.baseApi}/invitaciones/${clave}`;
      const response = await fetch(url);
      const result = await response.json();

      if (response.status !== 200) throw new Error('Invitación no encontrada.');

      return result;
    } catch (error) {
      throw new Error('Error al verificar la invitación.');
    }
  }

  // Marcar invitación como usada
  async marcarInvitacionUsada(clave) {
    try {
      const url = `${this.baseApi}/invitaciones/${clave}/usar`;

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

  // Eliminar invitación por clave
  async eliminarInvitacion(clave) {
    try {
      const url = `${this.baseApi}/invitaciones/${clave}`;

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

  // Convertir rol de string a número
  getRolNumber(rol) {
    switch (rol.toLowerCase()) {
        case 'deportista':
            return 1;
        case 'acudiente':
            return 2;
        case 'profesor':
            return 3;
        case 'administrador':
            return 4;
        case 'hijo':
            return 5;
        default:
            throw new Error('Rol no válido');
    }
}
}
