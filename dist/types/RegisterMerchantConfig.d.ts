import { P24BusinessTypeEnum } from "../enums/BusinessTypeEnum";
import { P24TradeCategory } from "../enums/TradeCategoryEnum";
export interface RegisterMerchantConfig {
    business_type: P24BusinessTypeEnum;
    name: string;
    email: string;
    pesel?: string;
    phone_number: string;
    bank_account: string;
    invoice_email: string;
    shopUrl?: string;
    services_description?: string;
    trade: P24TradeCategory;
    krs?: string;
    nip?: string;
    regon?: string;
    acceptance?: boolean;
    representatives?: RepresentativePerson[];
    contact_person: Contact;
    technical_contact: Contact;
    address: Address;
    correspondence_address: Address;
}
interface RepresentativePerson {
    name: string;
    pesel: string;
}
interface Contact {
    name: string;
    email: string;
    phone_number: string;
}
interface Address {
    country: 'PL';
    city: string;
    post_code: string;
    street: string;
}
export {};
