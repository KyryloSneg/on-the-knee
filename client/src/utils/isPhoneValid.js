import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil =  PhoneNumberUtil.getInstance();
export default function isPhoneValidFn(phone) {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};