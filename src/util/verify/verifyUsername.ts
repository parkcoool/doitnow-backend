export default function verifyUsername(username: string) {
  const nameRegex = /^[가-힣a-zA-Z]{2,20}$/;
  return nameRegex.test(username);
}
