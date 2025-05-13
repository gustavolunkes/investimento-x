import axios from "axios";
import { PropertieRoute } from "./route/properties/propertieRoute";
import { CityRoute } from "./route/city/cityRoute";

const server = axios.create({
  baseURL: "http://localhost:8081",
});

export class Api {
  propertie = new PropertieRoute(server);
  city = new CityRoute(server);
}
