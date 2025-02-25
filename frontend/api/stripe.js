import { basePath, apiVersion } from '../utils/config';

export class StripeAPI {
    baseApi = `${basePath}/${apiVersion}`;

    async createCheckoutSession(priceId) {
        try {
            const url = `${this.baseApi}/send-email`;

            const params = {
                method: 'POST',
                body: JSON.stringify({ priceId }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const res = await fetch(url, params);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Respuesta de la API de checkout:', errorText);
                throw new Error('Error en la solicitud de checkout');
            }

            const data = await res.json();
            console.log("✅ URL de checkout recibida:", data);

            return data.url;
        } catch (error) {
            console.error('❌ Error en el proceso de checkout:', error);
            alert('Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.');
        }
    }

    async getPrices() {
        try {

            const url = `${this.baseApi}/stripe-prices`;

            const params = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const res = await fetch(url, params);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Respuesta de la API de precios:', errorText);
                throw new Error('Error en la solicitud de precios');
            }

            const data = await res.json();

            return data;
        } catch (error) {
            console.error('❌ Error en el proceso de precios:', error);
            alert('Hubo un error al obtener los precios. Por favor, inténtalo de nuevo.');
        }
    }
}