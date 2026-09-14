import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, GraduationCap, LayoutDashboard, UserRound } from 'lucide-react';

const items = [
  ['/', '首页', Home], ['/calendar', '日历', CalendarDays], ['/learning', '学习', GraduationCap], ['/work', '工作台', LayoutDashboard], ['/me', '我的', UserRound]
] as const;

export function BottomNav() {
  return <nav className="nav">{items.map(([to,label,Icon]) => <NavLink key={to} to={to} end={to === '/'}>{({isActive}) => <><Icon size={20} strokeWidth={isActive ? 2.4 : 2}/><span>{label}</span></>}</NavLink>)}</nav>;
}
