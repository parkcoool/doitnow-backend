import CryptoJS from "crypto-js";

export default function getSaltedHash(password: string, salt?: string) {
  return CryptoJS.SHA512(`${password}${salt ?? ""}`).toString();
}
