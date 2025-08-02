import axios from "axios";
import { ValidateGateway } from "../../domain/validate/gateway/validate.gateway";
import { Validate } from "../../domain/validate/entity/validate.entity";

const BASE_URL = process.env.API_COMPLIANCE_URL;

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

        if (attempt === retries) {
          throw new Error("Invalid document.");
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
    return Validate.with(response.data.data);
  }

  async validateCnpj(document: string, accessToken: string): Promise<Validate> {
    const response = await this.postWithRetry(
      `${BASE_URL}/cnpj/validate`,
      { document },
      accessToken
    );
    return Validate.with(response.data.data);
  }
}
