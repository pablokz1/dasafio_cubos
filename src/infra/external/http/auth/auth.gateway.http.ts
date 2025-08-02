import axios from "axios";
import { AuthGateway } from "../../domain/auth/gateway/auth.gateway";

const BASE_URL = process.env.API_COMPLIANCE_URL;

export class AuthGatewayHttp implements AuthGateway {
    async requestCode(): Promise<{ userId: string; authCode: string }> {
        const response = await axios.post(`${BASE_URL}/auth/code`, {
            email: process.env.EMAIL,
            password: process.env.SENHA
        });

        const { userId, authCode } = response.data.data;

        return { userId, authCode };
    }


    async requestToken(authCode: string): Promise<{ idToken: string; accessToken: string; refreshToken: string }> {
        const response = await axios.post(`${BASE_URL}/auth/token`, { authCode });
        return response.data.data;
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        return response.data.data;
    }

}
