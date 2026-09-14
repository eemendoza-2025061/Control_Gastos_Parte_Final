export function toIsoDate(fecha: string | Date | null | undefined): string {
  if (fecha instanceof Date && !isNaN(fecha.getTime())) {
    const pad = (n: number) => (n < 10 ? '0' + n : String(n));
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
  }

  const raw = String(fecha ?? '').trim();
  if (!raw) {
    return '';
  }

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}`;
  }

  const dmy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  }

  return raw.slice(0, 10);
}

export function toDisplayDate(fecha: string | Date | null | undefined): string {
  const iso = toIsoDate(fecha);
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) {
    return iso;
  }
  return `${m[3]}/${m[2]}/${m[1]}`;
}

export function todayDisplay(): string {
  return toDisplayDate(new Date());
}

export function matchesSearch(term: unknown, ...parts: unknown[]): boolean {
  const needle = String(term ?? '').trim().toLowerCase();
  if (!needle) {
    return true;
  }
  return parts.some((part) => {
    const raw = String(part ?? '').toLowerCase();
    const display = toDisplayDate(part as string).toLowerCase();
    return raw.includes(needle) || display.includes(needle);
  });
}
