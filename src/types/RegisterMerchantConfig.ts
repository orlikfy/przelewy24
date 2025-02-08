import { P24BusinessTypeEnum } from "../enums/BusinessTypeEnum";
import { P24TradeCategory } from "../enums/TradeCategoryEnum";

export interface RegisterMerchantConfig {
  business_type: P24BusinessTypeEnum;
  name: string;
  email: string; // 50 characters
  pesel?: string; // Required if businessType === 1, unique, 11 chars
  phone_number: string;
  bank_account: string;
  invoice_email: string; // 50 characters
  shopUrl?: string; // Required if servicesDescription is not provided
  services_description?: string; // Required if shopUrl is not provided
  trade: P24TradeCategory;
  krs?: string; // Required if businessType > 3
  nip?: string; // Required if businessType !== 1
  regon?: string; // Required if businessType !== 1
  acceptance?: boolean; // Only available for selected partners
  representatives?: RepresentativePerson[];
  contact_person: Contact;
  technical_contact: Contact;
  address: Address;
  correspondence_address: Address;
}

interface RepresentativePerson {
  name: string; // <= 100 characters
  pesel: string; // 11 characters
}

interface Contact {
  name: string; // <= 50 characters imię i nazwisko
  email: string; // 50 characters
  phone_number: string;
}

interface Address {
  country: 'PL';
  city: string; // 3-50 characters
  post_code: string;
  street: string; // 3-100 characters
}
