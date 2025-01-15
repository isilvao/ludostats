import { basePath, apiVersion } from "./config";
import {JWT} from './config'

export class Auth {
    baseApiUrl = `${basePath}/${apiVersion}`;

    async register(data){
        try {
            const url = `${this.baseApiUrl}/register`;

            const params = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: data.nombre,
                    apellido: data.apellido,
                    correo: data.correo,
                    contrasena: data.contrasena,
                    rol: 'externo',
                    activo: true
                })
            }

            const response = await fetch(url, params);
            const result = await response.json();

            if (response.status !== 200) throw result;

            return result
        } catch (error) {
            throw error
        }
    }

    async login(data){
        try {
            const url = `${this.baseApiUrl}/login`;

            const params = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo: data.correo,
                    contrasena: data.contrasena,
                    rememberMe: data.rememberMe
                })
            }

            const response = await fetch(url, params);
            const result = await response.json();

            if (response.status !== 200) throw result;

            return result
        } catch (error) {
            throw error
        }
    }

    async refreshAccessToken(refreshToken){
        try {
            const url = `${this.baseApiUrl}/refreshAccessToken`;
            const params = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    refreshToken
                })
            }

            const response = await fetch(url, params);
            const result = await response.json();

            if (response.status !== 200) throw result;

            return result
        } catch (error) {
            throw error
        }
    }

    setAccessToken(token){
        localStorage.setItem(JWT.ACCESS, token)
    }

    getAccessToken(){
        return localStorage.getItem(JWT.ACCESS)
    }

    setRefreshToken(token){
        localStorage.setItem(JWT.REFRESH, token)
    }

    getRefreshToken(){
        return localStorage.getItem(JWT.REFRESH)
    }

    removeTokens(){
        localStorage.removeItem(JWT.ACCESS)
        localStorage.removeItem(JWT.REFRESH)
    }
}