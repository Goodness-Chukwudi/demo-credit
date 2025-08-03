import { GENDER } from "../../enums/enum";

interface SettlementAccountDTO {
  account_name: string;
  account_number: string;
  bank_name: string;
}

interface SignUpDTO {
  first_name: string;
  last_name: string;
  email: string;
  gender: GENDER;
  phone: string;
  address: string;
  dob: Date;
  new_password: string;
  confirm_password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

interface PasswordUpdateDTO {
  password: string;
  new_password: string;
  confirm_password: string;
}

export { SettlementAccountDTO, SignUpDTO, LoginDTO, PasswordUpdateDTO };
