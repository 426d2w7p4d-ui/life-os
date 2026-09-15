export const toLocalISO = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const todayISO = () => toLocalISO(new Date());

export const formatDateCN = (date = new Date()) =>
  new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(date);

export const daysBetween = (date: string, from = todayISO()) => {
  const a = new Date(from + 'T00:00:00');
  const b = new Date(date + 'T00:00:00');
  return Math.round((b.getTime() - a.getTime()) / 86400000);
};

export const minutesFromTime = (time: string) => {
  const [h,m] = time.split(':').map(Number);
  return h * 60 + m;
};

export const formatDuration = (minutes: number) => {
  const safe = Math.max(0, Math.ceil(minutes));
  const d = Math.floor(safe / 1440);
  const h = Math.floor((safe % 1440) / 60);
  const m = safe % 60;
  if (d > 0) return `${d} 天 ${h} 小时`;
  if (h > 0) return `${h} 小时${m ? ` ${m} 分钟` : ''}`;
  return `${m} 分钟`;
};

export const ageText = (date?: string) => {
  if (!date) return '未填写';
  const birth = new Date(`${date}T00:00:00`);
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
  if (now.getDate() < birth.getDate()) months--;
  months = Math.max(0, months);
  const years = Math.floor(months / 12);
  const remain = months % 12;
  return years ? `${years}岁${remain ? `${remain}月` : ''}` : `${remain}个月`;
};
