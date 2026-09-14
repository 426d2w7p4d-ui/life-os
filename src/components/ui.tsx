import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

export function PageHeader({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: ReactNode }) {
  return <header className="page-header"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{subtitle && <div className="subtle">{subtitle}</div>}</div>{action}</header>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <section className="section"><div className="section-head"><h2>{title}</h2>{action}</div>{children}</section>;
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return <div className="card empty"><strong>{title}</strong>{text && <p>{text}</p>}{action}</div>;
}

export function ProgressBar({ value, green = false }: { value: number; green?: boolean }) {
  const safe = Math.max(0, Math.min(100, value));
  return <div className="progress-track"><div className={`progress-fill ${green ? 'green' : ''}`} style={{ width: `${safe}%` }} /></div>;
}

export function ListLink({ icon, title, subtitle, onClick }: { icon?: ReactNode; title: string; subtitle?: string; onClick?: () => void }) {
  return <button onClick={onClick} className="list-link" style={{ width:'100%', borderTop:0, borderLeft:0, borderRight:0, background:'transparent', cursor:'pointer', textAlign:'left' }}><div className="row">{icon}<div><div style={{fontWeight:750}}>{title}</div>{subtitle && <div className="subtle" style={{fontSize:12}}>{subtitle}</div>}</div></div><ChevronRight size={18} color="#a2a7b0" /></button>;
}
