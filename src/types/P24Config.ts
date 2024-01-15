import { P24ConfigDefaultValues } from "./P24ConfigDefaultValues.js";


export interface P24Config {
  prod: boolean,
  merchantId: number,
  posId?: number,
  apiKey: string,
  crc: string,
  defaultValues: P24ConfigDefaultValues,
}
