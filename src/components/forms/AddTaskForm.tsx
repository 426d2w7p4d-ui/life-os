import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { X } from 'lucide-react';
import { db } from '../../db/database';
import { uid } from '../../utils/id';
import { todayISO } from '../../utils/date';
import type { Priority } from '../../types/models';

export function AddTaskForm({ onClose, defaultDate = todayISO() }: { onClose: () => void; defaultDate?: string }) {
  const calendars = useLiveQuery(()=>db.calendars.orderBy('order').toArray(),[]) ?? [];
  const [title,setTitle]=useState('');
  const [date,setDate]=useState(defaultDate);
  const [time,setTime]=useState('');
  const [category,setCategory]=useState('生活');
  const [priority,setPriority]=useState<Priority>('普通');
  const [calendarId,setCalendarId]=useState('');
  const [saving,setSaving]=useState(false);
  const save = async () => {
    if (!title.trim()) return;
    const cal = calendarId || calendars[0]?.id;
    if (!cal) return;
    setSaving(true);
    const now=new Date().toISOString();
    await db.tasks.add({id:uid(),title:title.trim(),calendarId:cal,category,tags:[],date,startTime:time||undefined,priority,status:'未开始',progress:0,subtasks:[],sourceType:'manual',createdAt:now,updatedAt:now});
    setSaving(false); onClose();
  };
  return <div className="overlay" onMouseDown={onClose}><div className="sheet" onMouseDown={e=>e.stopPropagation()}><div className="sheet-handle"/><div className="row between"><h2>新建任务</h2><button className="icon-btn" onClick={onClose}><X size={20}/></button></div><div className="stack">
    <div className="field"><label>任务名称</label><input autoFocus className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="例如：完成英语第一单元"/></div>
    <div className="grid two"><div className="field"><label>日期</label><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div><div className="field"><label>时间</label><input className="input" type="time" value={time} onChange={e=>setTime(e.target.value)}/></div></div>
    <div className="grid two"><div className="field"><label>日历</label><select className="select" value={calendarId} onChange={e=>setCalendarId(e.target.value)}><option value="">默认日历</option>{calendars.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div className="field"><label>分类</label><input className="input" value={category} onChange={e=>setCategory(e.target.value)}/></div></div>
    <div className="field"><label>优先级</label><select className="select" value={priority} onChange={e=>setPriority(e.target.value as Priority)}>{['低','普通','高','紧急'].map(x=><option key={x}>{x}</option>)}</select></div>
    <button className="btn primary" disabled={!title.trim()||saving} onClick={save}>{saving?'保存中…':'保存任务'}</button>
  </div></div></div>;
}
