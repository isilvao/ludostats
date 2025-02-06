'use client';

import { useState, useEffect, createContext } from 'react';
import { User, Auth } from '../api';
import { hasExpiredToken } from '../utils';

const userController = new User();
const authController = new Auth();

export const AuthContext = createContext();

export function AuthProvider(props) {
  const { children } = props;
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const accessToken = authController.getAccessToken();
      const refreshToken = authController.getRefreshToken();

      if (!accessToken || !refreshToken) {
        logout();
        setLoading(false);
        return;
      }

      if (hasExpiredToken(accessToken)) {
        if (hasExpiredToken(refreshToken)) {
          logout();
        } else {
          await reLogin(refreshToken);
        }
      } else {
        await login(accessToken);
      }
      setLoading(false);
    })();
  }, []);

  const reLogin = async (refreshToken) => {
    if (!refreshToken) {
      console.error('Refresh token is missing');
      return;
    }

    try {
      const response = await authController.refreshAccessToken(refreshToken);
      if (!response || !response.accessToken) {
        throw new Error('No access token in response');
      }
      const { accessToken } = response;
      authController.setAccessToken(accessToken);
      await login(accessToken);
    } catch (error) {
      if (error.msg !== 'No se ha encontrado el token') {
        console.error(
          'Error during reLogin:',
          error.message || error,
          JSON.stringify(error)
        );
      }
    }
  };

  const login = async (accessToken) => {
    try {
      const response = await userController.getMe(accessToken);
      setUser(response);
      setToken(accessToken);
    } catch (error) {
      console.error(
        'Error during login:',
        error.message || error,
        JSON.stringify(error)
      );
    }
  };

  const logout = async () => {
    return new Promise((resolve) => {
      // Simulamos un pequeño retraso para ilustrar un flujo asincrónico
      setTimeout(() => {
        setUser(null);
        setToken(null);
        authController.removeTokens();
        console.log('Cuenta cerrada exitosamente');
        resolve(); // Marca que la operación se ha completado
      }, 0); // Retraso mínimo; puede eliminarse si no es necesario
    });
  };

  const data = {
    accessToken: token,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}
