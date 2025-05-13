import { AxiosInstance } from "axios";
import { PropertiesAttributes, PropertiesDTOAttributes } from "./properties";

export class PropertieRoute {
  server: AxiosInstance | null;

  constructor(server: AxiosInstance | null) {
    this.server = server;
  }

  async getByUser(id: string): Promise<PropertiesAttributes[]> {
    return (await this.server?.get("imovel/" + id))?.data;
  }

  async delete(id: Number): Promise<String> {
    return await this.server?.delete("imovel/" + id);
  }

  async create(propertie: PropertiesDTOAttributes): Promise<PropertiesAttributes> {
    return await this.server?.post("imovel", propertie);
  }
}
