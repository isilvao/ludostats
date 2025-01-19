
import {apiVersion, basePath} from './config'
import jwtDecode from 'jwt-decode'

let storedOtp = null;

export class User {
    

    baseApi = `${basePath}/${apiVersion}`

    async getMe(accessToken){
        try {
            const url = `${this.baseApi}/user/me`

            const params = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            const response = await fetch(url, params)
            const result = await response.json()

            if (response.status !== 200) throw result

            return result
        } catch (error) {
            throw error
        }
    }

    async updateMe(accessToken, data){

        const { id } = data

        try {
            const url = `${this.baseApi}/user/${id}`

            const params = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            }

            const response = await fetch(url, params)
            const result = await response.json()

            if (response.status !== 200) throw result

            return result
        } catch (error) {
            throw error
        }
    }

    async deteleMe(accessToken, id){
        try {
            const url = `${this.baseApi}/user/${id}`

            const params = {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            const response = await fetch(url, params)
            const result = await response.json()

            if (response.status !== 200) throw result

            return result
        } catch (error) {
            throw error
        }
    }

    async getUserByEmail(correo) {
        try {
            console.log("llegue a la api del email")
            const url = `${this.baseApi}/user/email?correo=${correo}`;
            const response = await fetch(url);
            const result = await response.json();
            if (response.status !== 200) throw result;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async sendEmail(email, firstName) {
        // Generar un OTP aleatorio de 6 dígitos
        storedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
        try {
            // Crear el cuerpo de la solicitud
            const requestBody = {
                firstName,
                otp: storedOtp,
                email,
            };
    
            // Realizar la solicitud al servidor
            const response = await fetch("/api/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
    
            const data = await response.json();
    
            // Manejar respuesta del servidor
            if (!response.ok) {
                alert(`Error: ${data.error || "Ocurrió un error inesperado."}`);
                return;
            }
    
            alert("Correo enviado con éxito.");
            console.log("Respuesta del servidor:", data);
            return storedOtp;
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            alert("No se pudo enviar el correo. Inténtalo de nuevo.");
        }
    }
    
    // Función para verificar el OTP recibido
    verifyOtp(enteredOtp) {
        if (enteredOtp == storedOtp) {
            return true;  // OTP válido
        } else {
            return false; // OTP inválido
        }
    }

 


}