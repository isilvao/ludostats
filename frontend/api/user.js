import { apiVersion, basePath } from '../utils/config';

let storedOtp = null;
let storedOtp2 = null;

export class User {
  baseApi = `${basePath}/${apiVersion}`;

  async getMe(accessToken) {
    try {
      const url = `${this.baseApi}/user/me`;

      const params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateMe(data) {
    const { id } = data;

    try {
      const url = `${this.baseApi}/user/updateMe`;

      const params = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(data) {
    const { id } = data;

    try {
      const url = `${this.baseApi}/user/${id}`;

      const params = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateMePassword(data) {
    const { id } = data;

    // console.log(id,"entro a la api")
    //const baseApi = `https://ludostats.up.railway.app/api/v1`

    try {
      const url = `${this.baseApi}/user2/${id}`;

      const params = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      console.log('error observado por la api', error);
      throw error;
    }
  }

  async updatePasswordFromProfile(id, contrasena, nuevaContrasena) {
    try {
      const url = `${this.baseApi}/user/updatePasswordFromProfile/${id}`;

      const params = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contrasena, nuevaContrasena }),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deteleMe(accessToken, id) {
    try {
      const url = `${this.baseApi}/user/deleteAccount`;

      const params = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(correo) {
    try {
      const url = `${this.baseApi}/user/email?correo=${correo}`;
      const response = await fetch(url);
      const result = await response.json();
      if (response.status !== 200)
        throw new Error('El correo no existe en la plataforma.');
      return result;
    } catch (error) {
      throw new Error('El correo no existe en la plataforma.');
    }
  }

  async sendEmail(email, firstName) {
    storedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const requestBody = {
        firstName,
        otp: storedOtp,
        email,
      };

      console.log(3);

      const url = `${this.baseApi}/send-email/user`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error inesperado.');
      }

      return storedOtp;
    } catch (error) {
      throw new Error('No se pudo enviar el correo. Inténtalo de nuevo.');
    }
  }

  async sendEmailValidate(email, firstName, id) {
    storedOtp2 = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const requestBody = {
        firstName,
        otp: storedOtp2,
        email,
        id,
      };

      const url = `${this.baseApi}/send-email/user/login`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error inesperado.');
      }

      return storedOtp2;
    } catch (error) {
      throw new Error('No se pudo enviar el correo. Inténtalo de nuevo.');
    }
  }

  async getIsUserActive(user_id) {
    try {
      const url = `${this.baseApi}/isAccountValid/${user_id}`;
      const response = await fetch(url);

      if (!response.ok)
        throw new Error(
          'El usuario no existe o hay un problema en el servidor.'
        );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error al verificar el estado de la cuenta:', error);
      throw error;
    }
  }

  async activateUser(userId, enteredOtp) {
    // console.log(enteredOtp, storedOtp2);
    // if (enteredOtp != storedOtp2) {
    //   return false;
    // }
    try {
      const url = `${this.baseApi}/activateUser`;
      const params = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      console.error('Error al activar usuario:', error);
      throw error;
    }
  }

  /**
   * 📌 Obtener todos los clubes de un usuario.
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

      // console.log("📌 Clubes del usuario obtenidos:", result);
      return result;
    } catch (error) {
      console.error('❌ Error al obtener clubes del usuario:', error);
      throw error;
    }
  }

  async obtenerMisHijos(accessToken) {
    try {
      const url = `${this.baseApi}/children`;

      const params = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200)
        throw new Error(result.msg || 'Error al obtener los hijos.');

      // console.log("📌 Hijos obtenidos:", result);
      return result;
    } catch (error) {
      console.error('❌ Error al obtener hijos:', error);
      throw error;
    }
  }

  verifyOtp(enteredOtp) {
    return enteredOtp === storedOtp;
  }

  async actualizarFotoPerfil(userId, file) {
    try {
      const url = `${this.baseApi}/user_foto/${userId}`;
      const formData = new FormData();
      formData.append('foto', file);

      const params = {
        method: 'PATCH',
        body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();

      // if (response.status !== 200) throw result;

      // 📌 Devolver la URL de la imagen
      return result.foto;
    } catch (error) {
      throw error;
    }
  }
}
