export default function verifyImageUrl(url: string) {
  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(url);
}
