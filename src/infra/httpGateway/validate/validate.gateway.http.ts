import axios from "axios";
import { ValidateGateway } from "../../../domain/compliance/validate/gateway/validate.gateway";
import { Validate } from "../../../domain/compliance/validate/entity/validate.entity";

const BASE_URL = process.env.API_COMPLIANCE_URL;
const EMAIL = process.env.VALIDATE_EMAIL!;
const PASSWORD = process.env.VALIDATE_PASSWORD!;

if (!BASE_URL) {
  console.error("API_COMPLIANCE_URL não está definida no arquivo .env");
  throw new Error("API_COMPLIANCE_URL is not defined in the environment");
}

export class ValidateGatewayHttp implements ValidateGateway {
  private async postWithRetry(
    url: string,
    data: any,
    accessToken: string,
    retries = 3
  ): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response;
      } catch (error: any) {
        console.error(
          `[${new Date().toISOString()}] Error trying ${attempt} to call ${url}:`,
          error.message
        );

        if (attempt === retries) {
          throw new Error("Validation service currently unavailable.");
        }

        await new Promise((res) => setTimeout(res, 500 * attempt));
      }
    }
  }

  async validateCpf(document: string, accessToken: string): Promise<Validate> {
    const response = await this.postWithRetry(
      `${BASE_URL}/cpf/validate`,
      { document },
      accessToken
    );
    return Validate.with(response.data);
  }

  async validateCnpj(document: string, accessToken: string): Promise<Validate> {
    const response = await this.postWithRetry(
      `${BASE_URL}/cnpj/validate`,
      { document },
      accessToken
    );
    return Validate.with(response.data);
  }
}
