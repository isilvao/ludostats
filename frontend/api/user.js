import { apiVersion, basePath } from './config';
import jwtDecode from 'jwt-decode';

let storedOtp = null;

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

  async updateMe(accessToken, data) {
    const { id } = data;

    try {
      const url = `${this.baseApi}/user/${id}`;

      const params = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
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

  async deteleMe(accessToken, id) {
    try {
      const url = `${this.baseApi}/user/${id}`;

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

      const response = await fetch('/api/send', {
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

  verifyOtp(enteredOtp) {
    return enteredOtp === storedOtp;
  }
}
