export const LEAD_SUBJECT_TAG = '[kvainstalaciones.mx]';
export const DIRECT_CONTACT_TOPIC = 'Contacto';

const mexicanE164 = /^\+52[1-9][0-9]{9}$/;
const mailbox = /^[^\s@]+@[^\s@]+$/;

export interface MailtoInput {
  readonly email: string;
  readonly topic: string;
}

export function buildMailtoLink({ email, topic }: MailtoInput): string {
  if (!mailbox.test(email) || topic.trim().length === 0) {
    throw new Error('Invalid mailto input: expected an email address and a topic');
  }
  const address = encodeURIComponent(email).replace(/%40/g, '@');
  return `mailto:${address}?subject=${encodeURIComponent(`${LEAD_SUBJECT_TAG} ${topic}`)}`;
}

export function buildDirectMailtoLink(email: string): string {
  return buildMailtoLink({ email, topic: DIRECT_CONTACT_TOPIC });
}

export function buildTelLink(e164: string): string {
  if (!mexicanE164.test(e164)) throw new Error('Invalid phone: expected a Mexican E.164 number');
  return `tel:${e164}`;
}
