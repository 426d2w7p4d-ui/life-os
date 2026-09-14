export const todayISO = () => new Date().toISOString().slice(0, 10);

export const formatDateCN = (date = new Date()) =>
  new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(date);

export const daysBetween = (date: string) => {
  const a = new Date(todayISO() + 'T00:00:00');
  const b = new Date(date + 'T00:00:00');
  return Math.ceil((b.getTime() - a.getTime()) / 86400000);
};

export const toLocalISO = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
