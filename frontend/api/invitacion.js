import { apiVersion, basePath } from './config';

export class InvitacionesAPI {
  baseApi = `${basePath}/${apiVersion}`;

  // Función para generar una clave aleatoria de 6 caracteres
  generarClaveAleatoria() {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let clave = '';
    for (let i = 0; i < 10; i++) {
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
      console.log(claveGenerada);
      return claveGenerada;
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
        return 'deportista'; // Deportista
      case 'acudiente':
        return 'acudiente'; //Acudiente
      case 'profesor':
        return 'entrenador'; //Entrenador
      case 'administrador':
        return 'administrador'; //Administrador
      case 'hijo':
        return 'miembro'; //Dependiente/Hijo
      default:
        throw new Error('Rol no válido');
    }
  }
}
