export default function verifyName(name: string) {
  const nameRegex = /^[가-힣a-zA-Z0-9]{2,20}$/;
  return nameRegex.test(name);
}
