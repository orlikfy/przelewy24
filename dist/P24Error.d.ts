export declare class P24Error extends Error {
    errorCode: string;
    constructor(errorCode: string, errorMessage: string);
    static fromResponse(errorCode: string, errorMessage: string, error?: any): P24Error;
}
