import { basePath, apiVersion } from "./config";
import {JWT} from './config'

export class Auth {
    baseApiUrl = `${basePath}/${apiVersion}`;

    async register(data){
        try {
            const url = `${this.baseApiUrl}/register`;

             // 📌 No incluimos `foto` si es `undefined`
            const requestBody = {
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                contrasena: data.contrasena,
                ...(data.foto && { foto: data.foto }) // 📌 Solo añade foto si existe
            };

            const params = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
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

    setAccessToken(token, rememberMe){
        if (rememberMe){
            localStorage.setItem(JWT.ACCESS, token)
        }else {
            sessionStorage.setItem(JWT.ACCESS, token)
        }
    }

    getAccessToken(){
        return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    }

    removeAccessToken() {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
    }

    setRefreshToken(token, rememberMe){
        if (rememberMe){
            localStorage.setItem(JWT.REFRESH, token)
        }else {
            sessionStorage.setItem(JWT.REFRESH, token)
        }
    }

    getRefreshToken(){
        return localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
    }

    removeRefreshToken() {
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("refreshToken");
    }

    removeTokens(){
        this.removeAccessToken();
        this.removeRefreshToken()
    }
}