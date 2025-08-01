import { Validate } from "../entity/validate.entity";

export interface ValidateGateway {
  validateCpf(document: string, accessToken: string): Promise<Validate>;
  validateCnpj(document: string, accessToken: string): Promise<Validate>;
}
