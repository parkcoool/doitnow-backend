export default function verifyPassword(password: string) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/;
  return passwordRegex.test(password);
}
