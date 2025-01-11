import { basePath, apiVersion } from "./config";

export class Auth {
    baseApiUrl = `${basePath}/${apiVersion}`;

    async register(data){
        try {
            console.log("Si llega al register")

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

            console.log("Si llega al login")
            const url = `${this.baseApiUrl}/login`;

            const params = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo: data.correo,
                    contrasena: data.contrasena
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
}