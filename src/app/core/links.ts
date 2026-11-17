export function mailto(email: string, subject: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export function gmailCompose(email: string, subject: string): string {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: email,
    su: subject,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
}
