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

            return data;
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

    async isPaymentSuccessful() {

        const queryParams = new URLSearchParams(window.location.search);
        const sessionId = queryParams.get('payment');

        try {
            const url = `${this.baseApi}/is-payment-successful?payment=${sessionId}`;

            const params = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const res = await fetch(url, params);

            const data = await res.json();

            return data.payment;
        } catch (error) {
            console.error('❌ Error al obtener los datos:', error);
            alert('Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.');
        }
    }

    async userHasPayment(user_id) {
        try {
            const url = `${this.baseApi}/user-has-subscription/${user_id}`;

            const params = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const res = await fetch(url, params);

            const data = await res.json();

            return data;
        } catch (error) {
            console.error('❌ Error al obtener los datos:', error);
            alert('Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.');
        }
    }

}