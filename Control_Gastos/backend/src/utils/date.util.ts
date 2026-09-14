export function toIsoDate(value: unknown): string {
  if (value instanceof Date && !isNaN(value.getTime())) {
    const pad = (n: number) => (n < 10 ? '0' + n : String(n));
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  }

  const raw = String(value ?? '').trim();
  if (!raw) {
    throw new Error('La fecha es obligatoria');
  }

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}`;
  }

  const dmy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  }

  throw new Error('Fecha inválida. Use el formato DD/MM/AAAA');
}
