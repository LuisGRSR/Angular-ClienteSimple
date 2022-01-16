import { Punto } from "./punto/punto.types";

export interface trino {
  id: String;
  autor: String;
  post: String;
  lat: number;
  lon: number;
  Localizacion: Punto;
}
