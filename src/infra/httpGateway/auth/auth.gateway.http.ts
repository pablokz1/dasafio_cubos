import axios from "axios";
import { AuthGateway } from "../../../domain/compliance/auth/gateway/auth.gateway";

const BASE_URL = process.env.API_COMPLIANCE_URL;

export class AuthGatewayHttp implements AuthGateway {
    async requestCode(email: string, password: string): Promise<{ userId: string; authCode: string }> {
        const response = await axios.post(`${BASE_URL}/auth/code`, { email, password });
        return response.data;
    }

    async requestToken(authCode: string): Promise<{ idToken: string; accessToken: string; refreshToken: string }> {
        const response = await axios.post(`${BASE_URL}/auth/token`, { authCode });
        return response.data;
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        return response.data;
    }
}
