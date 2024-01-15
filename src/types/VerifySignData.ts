import { VerifyTransactionConfig } from "./VerifyTransactionConfig.js";


export interface VerifySignData extends VerifyTransactionConfig {
  currency: string,
}