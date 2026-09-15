import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSearchParams } from 'react-router-dom';
import { CalendarDays, ImagePlus, LayoutGrid, List, Plus, Trash2, X } from 'lucide-react';
import { db } from '../db/database';
import { uid } from '../utils/id';
import { daysBetween, todayISO } from '../utils/date';
import { fileToDataUrl } from '../utils/files';
import type { Countdown, CountdownMemory } from '../types/models';
import { Card, EmptyState, PageHeader, Section } from '../components/ui';

type Layout='cards'|'timeline'|'calendar';
const colors=['#6e6686','#ce7898','#6f82ef','#d18653','#4b9a77','#5f9ca1'];
const icons=['♡','🎂','A+','✈️','¥','🐾','🎓','⭐'];

export function CountdownsPage(){
  const items=useLiveQuery(()=>db.countdowns.toArray(),[])??[];
  const [params,setParams]=useSearchParams();
  const [add,setAdd]=useState(false);const [editing,setEditing]=useState<Countdown|null>(null);const [memoryFor,setMemoryFor]=useState<Countdown|null>(null);const [layout,setLayout]=useState<Layout>('cards');const [filter,setFilter]=useState('全部');
  useEffect(()=>{if(params.get('add')==='1'){setAdd(true);setParams({}, {replace:true})}},[params,setParams]);
  const categories=['全部',...Array.from(new Set(items.map(x=>x.category)))];
  const filtered=items.filter(x=>filter==='全部'||x.category===filter);
  const feature=useMemo(()=>[...filtered].sort((a,b)=>primaryDays(a)-primaryDays(b))[0],[filtered]);
  const memories=items.flatMap(x=>(x.memories||[]).map(m=>({...m,parent:x.name,parentId:x.id})));
  return <div className="page"><PageHeader eyebrow="重要的日子，不只是一个数字" title="纪念日" subtitle="倒数、正计时、照片、回忆和提醒都围绕日期展开。" action={<button className="icon-btn" onClick={()=>setAdd(true)} aria-label="添加纪念日"><Plus size={20}/></button>}/>
    <div className="category-strip">{categories.map(c=><button className={filter===c?'active':''} key={c} onClick={()=>setFilter(c)}>{c}</button>)}</div>
    {feature?<button className="card anniv-feature clean-button" onClick={()=>setEditing(feature)}><div className="anniv-content"><span className="badge glass">{feature.icon} {feature.category}</span><div className="count-big">{primaryDays(feature)}<small>天</small></div><div className="anniv-title">{feature.name}</div><div className="small faded">{featureSummary(feature)} · {feature.repeat}</div><div className="progress anniv-progress"><i style={{width:`${yearProgress(feature.date)}%`}}/></div><div className="tiny faded">今年已经走过 {yearProgress(feature.date)}%</div></div>{feature.coverImage&&<img src={feature.coverImage} className="anniv-cover" alt=""/>}</button>:<EmptyState title="还没有重要日期" text="加一个值得期待或值得记住的日子。" action={<button className="btn primary" onClick={()=>setAdd(true)}>添加纪念日</button>}/>} 
    {filtered.length>0&&<Section title="全部日子" action={<div className="layout-buttons"><button className={layout==='cards'?'active':''} onClick={()=>setLayout('cards')}><LayoutGrid size={15}/></button><button className={layout==='timeline'?'active':''} onClick={()=>setLayout('timeline')}><List size={15}/></button><button className={layout==='calendar'?'active':''} onClick={()=>setLayout('calendar')}><CalendarDays size={15}/></button></div>}>
      {layout==='cards'&&<div className="anniv-cards">{filtered.map((x,i)=><button className={`card anniv-small anniv-tone-${i%4} clean-button`} key={x.id} onClick={()=>setEditing(x)}><div className="eyebrow">{x.mode==='正计时'?'已经陪伴 / 走过':x.mode==='同时显示'?'距离下一次':'距离日期'}</div><b>{x.name}</b><div className="anniv-num">{primaryDays(x)} <span className="tiny">天</span></div>{x.mode==='同时显示'&&<div className="tiny muted">已经 {elapsedDays(x)} 天</div>}<div className="anniv-icon">{x.icon||icons[i%icons.length]}</div></button>)}</div>}
      {layout==='timeline'&&<div className="card anniv-timeline">{[...filtered].sort((a,b)=>a.date.localeCompare(b.date)).map(x=><button className="anniv-line clean-button" key={x.id} onClick={()=>setEditing(x)}><span className="anniv-dot" style={{background:x.color}}/><div className="grow"><strong>{x.name}</strong><div className="subtle tiny">{x.date} · {x.category}</div></div><b>{x.mode==='正计时'?`已经 ${elapsedDays(x)} 天`:`还有 ${nextDays(x)} 天`}</b></button>)}</div>}
      {layout==='calendar'&&<AnnivCalendar items={filtered}/>} 
    </Section>}
    <Section title="回忆相册" action={feature?<button className="text-btn" onClick={()=>setMemoryFor(feature)}>＋ 记录</button>:undefined}><div className="album-strip">{memories.length?memories.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(m=><div className="memory" key={m.id} style={m.image?{backgroundImage:`linear-gradient(0deg,rgba(20,22,28,.55),rgba(20,22,28,.05)),url(${m.image})`,color:'#fff'}:{}}><span>{m.date.slice(0,4)} · {m.title}</span><small>{m.parent}</small></div>):<button className="memory add-memory" onClick={()=>feature?setMemoryFor(feature):setAdd(true)}><ImagePlus size={22}/><span>添加第一段回忆</span></button>}</div></Section>
    {(add||editing)&&<CountdownForm item={editing} onClose={()=>{setAdd(false);setEditing(null)}}/>}
    {memoryFor&&<MemoryForm item={memoryFor} onClose={()=>setMemoryFor(null)}/>} 
  </div>
}

function dateOnly(d:Date){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function elapsedDays(item:Countdown){const start=new Date(`${item.date}T00:00:00`);return Math.max(0,Math.floor((dateOnly(new Date()).getTime()-start.getTime())/86400000))}
function nextDays(item:Countdown){
  const now=dateOnly(new Date());const base=new Date(`${item.date}T00:00:00`);let target=dateOnly(base);
  if(item.repeat==='每年'){target=new Date(now.getFullYear(),base.getMonth(),base.getDate());if(target<now)target.setFullYear(target.getFullYear()+1)}
  else if(item.repeat==='每月'){target=new Date(now.getFullYear(),now.getMonth(),base.getDate());if(target<now)target=new Date(now.getFullYear(),now.getMonth()+1,base.getDate())}
  return Math.max(0,Math.ceil((target.getTime()-now.getTime())/86400000));
}
function primaryDays(item:Countdown){return item.mode==='正计时'?elapsedDays(item):nextDays(item)}
function featureSummary(item:Countdown){if(item.mode==='正计时')return `已经 ${elapsedDays(item)} 天`;if(item.mode==='同时显示')return `还有 ${nextDays(item)} 天 · 已经 ${elapsedDays(item)} 天`;return `还有 ${nextDays(item)} 天`}

function yearProgress(date:string){const d=new Date(`${date}T12:00:00`);const now=new Date();const y=d.getFullYear()===now.getFullYear()?now.getFullYear():now.getFullYear();const start=new Date(y,0,1).getTime();const end=new Date(y+1,0,1).getTime();return Math.round((Date.now()-start)/(end-start)*100)}

function CountdownForm({item,onClose}:{item:Countdown|null;onClose:()=>void}){
  const [name,setName]=useState(item?.name||'');const [date,setDate]=useState(item?.date||'');const [category,setCategory]=useState(item?.category||'生日');const [mode,setMode]=useState<Countdown['mode']>(item?.mode||'倒计时');const [repeat,setRepeat]=useState<Countdown['repeat']>(item?.repeat||'每年');const [icon,setIcon]=useState(item?.icon||'♡');const [color,setColor]=useState(item?.color||colors[0]);const [notes,setNotes]=useState(item?.notes||'');const [cover,setCover]=useState(item?.coverImage||'');const [reminder,setReminder]=useState(item?.reminderDays??7);const [saving,setSaving]=useState(false);
  const save=async()=>{if(!name.trim()||!date)return;setSaving(true);const data={name:name.trim(),date,category,mode,repeat,icon,color,notes:notes.trim()||undefined,coverImage:cover||undefined,reminderDays:reminder,memories:item?.memories||[]};if(item)await db.countdowns.update(item.id,data);else await db.countdowns.add({id:uid(),...data,createdAt:new Date().toISOString()});setSaving(false);onClose()};
  return <div className="overlay" onMouseDown={onClose}><div className="sheet" onMouseDown={e=>e.stopPropagation()}><div className="sheet-handle"/><div className="row between"><div><h2>{item?'编辑纪念日':'新建纪念日'}</h2><div className="subtle tiny">生日、考试、旅行、工资日都可以自定义。</div></div><button className="icon-btn" onClick={onClose}><X size={20}/></button></div><div className="stack form-stack"><div className="field"><label>名称 *</label><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="例如：妈妈生日"/></div><div className="grid two"><div className="field"><label>日期</label><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div><div className="field"><label>类型</label><select className="select" value={category} onChange={e=>setCategory(e.target.value)}>{['生日','纪念日','考试','旅行','工资日','宠物','项目交付','自定义'].map(x=><option key={x}>{x}</option>)}</select></div></div><div className="grid two"><div className="field"><label>计时方式</label><select className="select" value={mode} onChange={e=>setMode(e.target.value as Countdown['mode'])}><option>倒计时</option><option>正计时</option><option>同时显示</option></select></div><div className="field"><label>重复</label><select className="select" value={repeat} onChange={e=>setRepeat(e.target.value as Countdown['repeat'])}><option>每年</option><option>每月</option><option>不重复</option></select></div></div><div className="field"><label>图标</label><div className="icon-picker">{icons.map(x=><button key={x} className={icon===x?'selected':''} onClick={()=>setIcon(x)}>{x}</button>)}</div></div><div className="field"><label>主题颜色</label><div className="color-picker">{colors.map(x=><button key={x} className={color===x?'selected':''} style={{background:x}} onClick={()=>setColor(x)} aria-label={`选择颜色 ${x}`}/>)}</div></div><label className="upload-zone"><ImagePlus size={20}/><span>{cover?'更换封面照片':'添加封面 / 照片'}</span><input type="file" accept="image/*" onChange={async e=>{const f=e.target.files?.[0];if(f)setCover(await fileToDataUrl(f))}}/></label>{cover&&<img className="form-image-preview" src={cover} alt="封面预览"/>}<div className="field"><label>提前提醒</label><select className="select" value={reminder} onChange={e=>setReminder(Number(e.target.value))}><option value={0}>当天</option><option value={1}>提前 1 天</option><option value={7}>提前 7 天</option><option value={30}>提前 30 天</option></select></div><div className="field"><label>备注</label><textarea className="textarea" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="想记住的话、计划、礼物灵感……"/></div>{item&&<button className="btn danger" onClick={async()=>{if(confirm(`删除“${item.name}”？`)){await db.countdowns.delete(item.id);onClose()}}}><Trash2 size={16}/>删除</button>}<button className="btn primary" disabled={!name.trim()||!date||saving} onClick={save}>{saving?'保存中…':'保存纪念日'}</button></div></div></div>
}

function MemoryForm({item,onClose}:{item:Countdown;onClose:()=>void}){
  const [title,setTitle]=useState('');const [date,setDate]=useState(todayISO());const [note,setNote]=useState('');const [image,setImage]=useState('');
  const save=async()=>{if(!title.trim())return;const memory:CountdownMemory={id:uid(),title:title.trim(),date,note:note.trim()||undefined,image:image||undefined};await db.countdowns.update(item.id,{memories:[...(item.memories||[]),memory]});onClose()};
  return <div className="overlay" onMouseDown={onClose}><div className="sheet" onMouseDown={e=>e.stopPropagation()}><div className="sheet-handle"/><div className="row between"><h2>记录一段回忆</h2><button className="icon-btn" onClick={onClose}><X size={20}/></button></div><div className="stack form-stack"><div className="field"><label>标题</label><input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="例如：海边旅行"/></div><div className="field"><label>日期</label><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div><label className="upload-zone"><ImagePlus size={20}/><span>添加照片</span><input type="file" accept="image/*" onChange={async e=>{const f=e.target.files?.[0];if(f)setImage(await fileToDataUrl(f))}}/></label><div className="field"><label>文字</label><textarea className="textarea" value={note} onChange={e=>setNote(e.target.value)}/></div><button className="btn primary" disabled={!title.trim()} onClick={save}>保存回忆</button></div></div></div>
}

function AnnivCalendar({items}:{items:Countdown[]}){
  const now=new Date();const first=new Date(now.getFullYear(),now.getMonth(),1);const start=new Date(first);const day=first.getDay()||7;start.setDate(first.getDate()-day+1);const dates=Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d});
  return <div className="card"><div className="weeknames">{['一','二','三','四','五','六','日'].map(x=><div key={x}>周{x}</div>)}</div><div className="month-grid compact-month">{dates.map(d=>{const iso=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const hit=items.find(x=>x.date.slice(5)===iso.slice(5));return <div className={`daycell ${d.getMonth()!==now.getMonth()?'other':''}`} key={iso}><span className="dn">{d.getDate()}</span>{hit&&<span className="anniv-calendar-mark" style={{background:hit.color}}>{hit.icon}</span>}</div>})}</div></div>
}
