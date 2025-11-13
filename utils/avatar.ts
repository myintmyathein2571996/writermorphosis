import md5 from 'md5';

export function getGravatarUrl(email: string, size = 96): string {
  if (!email) return `https://cdn-icons-png.flaticon.com/512/847/847969.png`;
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}
