import { useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { db } from '../db/database';
import { todayISO, toLocalISO } from '../utils/date';
import { Card, PageHeader } from '../components/ui';
import type { Task, Course } from '../types/models';
import { AddTaskForm } from '../components/forms/AddTaskForm';

type ViewMode='year'|'month'|'week'|'day';
const weekNames=['一','二','三','四','五','六','日'];
const pad=(n:number)=>String(n).padStart(2,'0');
const clone=(d:Date)=>new Date(d.getFullYear(),d.getMonth(),d.getDate());
const dateFromISO=(s:string)=>new Date(`${s}T12:00:00`);
function mondayOf(d:Date){const x=clone(d);const day=x.getDay()||7;x.setDate(x.getDate()-day+1);return x}
function addDays(d:Date,n:number){const x=clone(d);x.setDate(x.getDate()+n);return x}
function monthCells(d:Date){const first=new Date(d.getFullYear(),d.getMonth(),1);const start=mondayOf(first);return Array.from({length:42},(_,i)=>addDays(start,i))}

export function CalendarPage(){
  const [mode,setMode]=useState<ViewMode>('month');
  const [cursor,setCursor]=useState(()=>new Date());
  const [selected,setSelected]=useState(todayISO());
  const [addTask,setAddTask]=useState(false);
  const touchX=useRef<number|null>(null);
  const tasks=useLiveQuery(()=>db.tasks.toArray(),[])??[];
  const courses=useLiveQuery(()=>db.courses.toArray(),[])??[];

  const selectedDate=dateFromISO(selected);
  const shift=(dir:number)=>{
    const d=clone(cursor);
    if(mode==='year') d.setFullYear(d.getFullYear()+dir);
    if(mode==='month') d.setMonth(d.getMonth()+dir);
    if(mode==='week') d.setDate(d.getDate()+7*dir);
    if(mode==='day') d.setDate(d.getDate()+dir);
    setCursor(d); if(mode==='day'){setSelected(toLocalISO(d))}
  };
  const title=mode==='year'?`${cursor.getFullYear()} 年`:mode==='month'?`${cursor.getFullYear()} 年 ${cursor.getMonth()+1} 月`:mode==='week'?`${toLocalISO(mondayOf(cursor)).slice(5)} ～ ${toLocalISO(addDays(mondayOf(cursor),6)).slice(5)}`:`${selectedDate.getMonth()+1} 月 ${selectedDate.getDate()} 日`;
  const onSwipeEnd=(x:number)=>{if(touchX.current===null)return;const dx=x-touchX.current;touchX.current=null;if(Math.abs(dx)>55)shift(dx<0?1:-1)};

  const eventsFor=(date:Date)=>{
    const iso=toLocalISO(date);const wd=date.getDay()||7;
    return {tasks:tasks.filter(t=>t.date===iso),courses:courses.filter(c=>c.weekday===wd)};
  };
  const hours=[8,10,12,14,16,18,20];
  const weekStart=mondayOf(cursor);
  const weekDates=Array.from({length:7},(_,i)=>addDays(weekStart,i));

  return <div className="page"><PageHeader eyebrow="任务 · 课程 · 工作 · 生活" title="日历" subtitle="年、月、周、日自由切换；月历可左右滑动，点日期可以进入当天。" action={<button className="icon-btn" onClick={()=>setAddTask(true)} aria-label="添加任务"><Plus size={20}/></button>}/>
    <div className="segment calendar-segment">{(['year','month','week','day'] as ViewMode[]).map(v=><button key={v} className={mode===v?'active':''} onClick={()=>{setMode(v);if(v==='day')setSelected(toLocalISO(cursor))}}>{v==='year'?'年':v==='month'?'月':v==='week'?'周':'日'}</button>)}</div>
    <div className="calendar-head"><button className="round" onClick={()=>shift(-1)} aria-label="上一页"><ChevronLeft size={18}/></button><div className="month-title">{title}</div><button className="round" onClick={()=>shift(1)} aria-label="下一页"><ChevronRight size={18}/></button></div>
    <div className="cal-viewport" onTouchStart={e=>{touchX.current=e.touches[0].clientX}} onTouchEnd={e=>onSwipeEnd(e.changedTouches[0].clientX)}>
      {mode==='month'&&<><div className="weeknames">{weekNames.map(x=><div key={x}>周{x}</div>)}</div><div className="month-grid">{monthCells(cursor).map(d=>{const iso=toLocalISO(d);const ev=eventsFor(d);const own=d.getMonth()===cursor.getMonth();return <button key={iso} className={`daycell ${own?'':'other'} ${iso===todayISO()?'today':''} ${iso===selected?'selected':''}`} onClick={()=>{setSelected(iso);setCursor(d)}}><span className="dn">{d.getDate()}</span><span className="events">{ev.courses.slice(0,2).map(c=><i key={c.id} className="event-dot" style={{background:c.color}}/>)}{ev.tasks.slice(0,2).map(t=><i key={t.id} className={`event-dot ${t.status==='已完成'?'green':'orange'}`}/>)}</span>{(ev.courses[0]||ev.tasks[0])&&<span className="event-label">{ev.courses[0]?.name||ev.tasks[0]?.title}</span>}</button>})}</div><div className="swipe-hint">左右滑动切换月份 · 点某一天查看当天</div></>}
      {mode==='year'&&<div className="year-grid">{Array.from({length:12},(_,m)=>{const d=new Date(cursor.getFullYear(),m,1);const hits=tasks.filter(t=>t.date.startsWith(`${cursor.getFullYear()}-${pad(m+1)}`)).length;return <button key={m} className="mini-month" onClick={()=>{setCursor(d);setMode('month')}}><h4>{m+1} 月 <span>{hits?`${hits}项`:''}</span></h4><div className="mini-dots">{Array.from({length:35},(_,i)=><i key={i} className={i%Math.max(3,10-Math.min(hits,7))===0&&hits?'hit':''}/>)}</div></button>})}</div>}
      {mode==='week'&&<div className="week-grid"><div className="week-row week-header"><div></div>{weekDates.map(d=><button key={toLocalISO(d)} onClick={()=>{setSelected(toLocalISO(d));setCursor(d);setMode('day')}}><b>周{weekNames[(d.getDay()+6)%7]}</b><span>{d.getDate()}</span></button>)}</div>{hours.map(h=><div className="week-row" key={h}><div className="week-time">{pad(h)}:00</div>{weekDates.map(d=>{const ev=eventsFor(d);const c=ev.courses.find(x=>Number(x.startTime.slice(0,2))>=h&&Number(x.startTime.slice(0,2))<h+2);const t=ev.tasks.find(x=>x.startTime&&Number(x.startTime.slice(0,2))>=h&&Number(x.startTime.slice(0,2))<h+2);return <div key={toLocalISO(d)}>{c?<div className="week-event" style={{background:`${c.color}1a`,color:c.color}}>{c.name}<small>{c.startTime}</small></div>:t?<div className="week-event task-event">{t.title}<small>{t.startTime}</small></div>:null}</div>})}</div>)}</div>}
      {mode==='day'&&<DayView date={selectedDate} tasks={tasks.filter(t=>t.date===selected)} courses={courses.filter(c=>c.weekday===(selectedDate.getDay()||7))}/>} 
    </div>
    {mode!=='day'&&selected&&<Card className="calendar-selection"><div className="row between"><div><div className="eyebrow">已选择</div><strong>{selectedDate.getMonth()+1} 月 {selectedDate.getDate()} 日 · 周{weekNames[(selectedDate.getDay()+6)%7]}</strong></div><button className="btn small softblue" onClick={()=>{setCursor(selectedDate);setMode('day')}}>查看当天</button></div></Card>}
    {addTask&&<AddTaskForm defaultDate={selected} onClose={()=>setAddTask(false)}/>} 
  </div>
}

function DayView({date,tasks,courses}:{date:Date;tasks:Task[];courses:Course[]}){
  const all=[...courses.map(c=>({id:c.id,time:c.startTime,end:c.endTime,title:c.name,meta:`课程 · ${c.room||'未填教室'} · ${c.teacher||'未填教师'}`,color:c.color,type:'course'})),...tasks.map(t=>({id:t.id,time:t.startTime||'全天',end:t.endTime,title:t.title,meta:`${t.category} · ${t.status}`,color:'#d18653',type:'task'}))].sort((a,b)=>a.time.localeCompare(b.time));
  return <div className="day-view"><div className="day-view-title"><b>{date.getMonth()+1}月{date.getDate()}日</b><span>{all.length} 项安排</span></div>{all.length?<div className="day-timeline">{all.map(e=><div className="time-block" key={`${e.type}-${e.id}`}><div className="time-label">{e.time}</div><div className="time-line"><div className="timeline-event" style={{borderLeftColor:e.color}}><strong>{e.title}</strong><div className="subtle tiny">{e.end?`${e.time}–${e.end} · `:''}{e.meta}</div></div></div></div>)}</div>:<div className="empty"><strong>这一天很干净</strong><span>暂时没有课程或任务。</span></div>}</div>
}
