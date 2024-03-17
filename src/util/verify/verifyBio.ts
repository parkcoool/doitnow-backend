export default function verifyBio(bio: string) {
  const bioRegex = /^.{0,100}$/;
  return bioRegex.test(bio);
}
