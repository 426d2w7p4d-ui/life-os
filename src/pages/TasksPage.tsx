import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Trash2 } from 'lucide-react';
import { db } from '../db/database';
import { PageHeader, Card, EmptyState, Section } from '../components/ui';
import { TaskItem } from '../components/TaskItem';
import { AddTaskForm } from '../components/forms/AddTaskForm';

export function TasksPage(){const [add,setAdd]=useState(false);const tasks=useLiveQuery(()=>db.tasks.orderBy('date').reverse().toArray(),[])??[];return <div className="page"><PageHeader title="任务" subtitle="所有任务都从这里汇总，也会出现在对应日历和今日首页。" action={<button className="btn primary small" onClick={()=>setAdd(true)}><Plus size={16}/>新建</button>}/>{tasks.length?<Section title={`全部任务 · ${tasks.length}`}><Card>{tasks.map(t=><div key={t.id} className="row between"><div style={{flex:1}}><TaskItem task={t}/></div><button className="btn ghost small" onClick={async()=>{if(confirm(`确定删除“${t.title}”吗？`))await db.tasks.delete(t.id)}}><Trash2 size={16}/></button></div>)}</Card></Section>:<EmptyState title="还没有任务" text="从第一件要做的事开始。" action={<button className="btn primary small" onClick={()=>setAdd(true)}>添加任务</button>}/>} {add&&<AddTaskForm onClose={()=>setAdd(false)}/>}</div>}
