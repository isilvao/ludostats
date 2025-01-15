
import {apiVersion, basePath} from './config'

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
}