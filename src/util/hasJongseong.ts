export default function hasJongseong(str: string) {
  const code = str.charCodeAt(str.length - 1) - 44032;
  return code % 28 !== 0;
}
