import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { FileUp, X } from 'lucide-react';
import { db } from '../../db/database';
import { uid } from '../../utils/id';
import { todayISO } from '../../utils/date';
import { filesToAttachments } from '../../utils/files';
import type { Attachment, Priority } from '../../types/models';

export function AddTaskForm({ onClose, defaultDate = todayISO() }: { onClose: () => void; defaultDate?: string }) {
  const calendars = useLiveQuery(()=>db.calendars.orderBy('order').toArray(),[]) ?? [];
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [date,setDate]=useState(defaultDate);
  const [time,setTime]=useState('');
  const [endTime,setEndTime]=useState('');
  const [category,setCategory]=useState('生活');
  const [priority,setPriority]=useState<Priority>('普通');
  const [calendarId,setCalendarId]=useState('');
  const [attachments,setAttachments]=useState<Attachment[]>([]);
  const [saving,setSaving]=useState(false);
  const save = async () => {
    if (!title.trim()) return;
    const cal = calendarId || calendars[0]?.id;
    if (!cal) return;
    setSaving(true);
    const now=new Date().toISOString();
    await db.tasks.add({id:uid(),title:title.trim(),description:description.trim()||undefined,calendarId:cal,category,tags:[],date,startTime:time||undefined,endTime:endTime||undefined,priority,status:'未开始',progress:0,subtasks:[],attachments,sourceType:'manual',createdAt:now,updatedAt:now});
    setSaving(false); onClose();
  };
  return <div className="overlay" onMouseDown={onClose}><div className="sheet" onMouseDown={e=>e.stopPropagation()}><div className="sheet-handle"/><div className="row between"><div><h2>新建任务</h2><div className="subtle tiny">可以写文字说明，也可以附图片或文件。</div></div><button className="icon-btn" onClick={onClose}><X size={20}/></button></div><div className="stack form-stack">
    <div className="field"><label>任务名称 *</label><input autoFocus className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="例如：完成英语第一单元"/></div>
    <div className="field"><label>说明</label><textarea className="textarea" value={description} onChange={e=>setDescription(e.target.value)} placeholder="补充要求、步骤、链接说明……"/></div>
    <div className="grid two"><div className="field"><label>日期</label><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div><div className="field"><label>日历</label><select className="select" value={calendarId} onChange={e=>setCalendarId(e.target.value)}><option value="">默认日历</option>{calendars.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div></div>
    <div className="grid two"><div className="field"><label>开始时间</label><input className="input" type="time" value={time} onChange={e=>setTime(e.target.value)}/></div><div className="field"><label>结束时间</label><input className="input" type="time" value={endTime} onChange={e=>setEndTime(e.target.value)}/></div></div>
    <div className="grid two"><div className="field"><label>分类</label><input className="input" value={category} onChange={e=>setCategory(e.target.value)}/></div><div className="field"><label>优先级</label><select className="select" value={priority} onChange={e=>setPriority(e.target.value as Priority)}>{['低','普通','高','紧急'].map(x=><option key={x}>{x}</option>)}</select></div></div>
    <label className="upload-zone"><FileUp size={20}/><span>上传图片 / PDF / 文件</span><small>小文件会保存在本机数据库和备份中</small><input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={async e=>e.target.files&&setAttachments(await filesToAttachments(e.target.files))}/></label>
    {attachments.length>0&&<div className="attachment-list">{attachments.map(a=><span key={a.id}>{a.name}</span>)}</div>}
    <button className="btn primary" disabled={!title.trim()||saving} onClick={save}>{saving?'保存中…':'保存任务'}</button>
  </div></div></div>;
}
