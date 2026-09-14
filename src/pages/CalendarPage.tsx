import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { toLocalISO } from '../utils/date';
import { Card, PageHeader, Section } from '../components/ui';
import { TaskItem } from '../components/TaskItem';

export function CalendarPage(){
 const [selected,setSelected]=useState(toLocalISO(new Date()));
 const days=useMemo(()=>Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i-2);return d}),[]);
 const tasks=useLiveQuery(()=>db.tasks.where('date').equals(selected).toArray(),[selected])??[];
 const wd=(new Date(selected+'T12:00:00').getDay()||7);
 const courses=useLiveQuery(()=>db.courses.where('weekday').equals(wd).toArray(),[wd])??[];
 return <div className="page"><PageHeader eyebrow="月 · 周 · 日" title="日历" subtitle="把任务、课程、工作和生活放在同一条时间线上。"/>
 <div className="calendar-strip">{days.map(d=>{const iso=toLocalISO(d);return <button key={iso} className={`day-chip ${iso===selected?'active':''}`} onClick={()=>setSelected(iso)}><span>{['日','一','二','三','四','五','六'][d.getDay()]}</span><span className="n">{d.getDate()}</span></button>})}</div>
 <Section title={selected===toLocalISO(new Date())?'今天':'当天安排'}><Card>{courses.map(c=><div key={c.id} className="timeline-item"><div className="timeline-time">{c.startTime}</div><div className="card compact timeline-card" style={{boxShadow:'none',borderLeftColor:c.color}}><strong>{c.name}</strong><div className="subtle">{c.endTime} · {c.room||'未填教室'}</div></div></div>)}{tasks.map(t=><TaskItem key={t.id} task={t}/>)}{!tasks.length&&!courses.length&&<div className="empty"><strong>这一天很干净</strong><span>暂时没有安排。</span></div>}</Card></Section>
 </div>
}
