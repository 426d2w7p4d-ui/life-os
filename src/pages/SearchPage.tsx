import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search } from 'lucide-react';
import { db } from '../db/database';
import { Card, EmptyState, PageHeader, Section } from '../components/ui';

export function SearchPage(){const [q,setQ]=useState('');const tasks=useLiveQuery(()=>db.tasks.toArray(),[])??[];const courses=useLiveQuery(()=>db.courses.toArray(),[])??[];const clients=useLiveQuery(()=>db.clients.toArray(),[])??[];const videos=useLiveQuery(()=>db.videos.toArray(),[])??[];const pets=useLiveQuery(()=>db.pets.toArray(),[])??[];const memos=useLiveQuery(()=>db.memos.toArray(),[])??[];const countdowns=useLiveQuery(()=>db.countdowns.toArray(),[])??[];const key=q.trim().toLowerCase();const groups=useMemo(()=>{if(!key)return[];return [
['任务',tasks.filter(x=>(x.title+' '+(x.description||'')+' '+x.category).toLowerCase().includes(key)).map(x=>x.title)],
['课程',courses.filter(x=>(x.name+' '+(x.teacher||'')+' '+(x.room||'')).toLowerCase().includes(key)).map(x=>x.name)],
['客户',clients.filter(x=>(x.name+' '+(x.account||'')).toLowerCase().includes(key)).map(x=>x.name)],
['视频',videos.filter(x=>(x.title+' '+(x.topic||'')+' '+(x.copy||'')).toLowerCase().includes(key)).map(x=>x.title)],
['宠物',pets.filter(x=>(x.name+' '+x.species+' '+(x.breed||'')).toLowerCase().includes(key)).map(x=>x.name)],
['备忘录',memos.filter(x=>(x.title+' '+x.content).toLowerCase().includes(key)).map(x=>x.title)],
['纪念日',countdowns.filter(x=>x.name.toLowerCase().includes(key)).map(x=>x.name)]
] as [string,string[]][]},[key,tasks,courses,clients,videos,pets,memos,countdowns]);const count=groups.reduce((s,g)=>s+g[1].length,0);return <div className="page"><PageHeader title="全局搜索" subtitle="任务、课程、客户、视频、宠物和备忘录一起搜。"/><div className="search-box"><div className="card row"><Search size={20} color="#8a9099"/><input className="input" style={{border:0,boxShadow:'none',padding:0,minHeight:38}} value={q} onChange={e=>setQ(e.target.value)} autoFocus placeholder="输入关键词…"/></div></div>{!key?<EmptyState title="搜点什么" text="例如：英语、客户 A、驱虫、视频。"/>:count===0?<EmptyState title="没有找到结果" text="换一个关键词试试。"/>:<Section title={`找到 ${count} 条结果`}><div className="stack">{groups.filter(g=>g[1].length).map(([name,items])=><Card key={name}><h3>{name}</h3>{items.map((x,i)=><div className="list-link" key={i}><span>{x}</span></div>)}</Card>)}</div></Section>}</div>}
