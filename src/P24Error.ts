// src/P24Error.ts
import { P24ErrorCodeMapping } from './error-mapping';

export class P24Error extends Error {
  public errorCode: string;

  constructor(errorCode: string, errorMessage: string) {
    super(errorMessage);
    this.errorCode = errorCode;
    this.name = 'P24Error';
  }

  static fromResponse(errorCode: string, errorMessage: string, error: any): P24Error {
    const mappedMessage = P24ErrorCodeMapping[errorCode] || errorMessage;
    if(!mappedMessage) {
      console.warn(`Unknown error code: ${errorCode}, not able to extract error message, just logging error.`);
      console.error(error?.response?.data || error);
    }
    return new P24Error(errorCode, mappedMessage);
  }
}
