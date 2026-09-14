import { Check } from 'lucide-react';
import { db } from '../db/database';
import type { Task } from '../types/models';

export function TaskItem({ task }: { task: Task }) {
  const done = task.status === '已完成';
  const toggle = async () => {
    await db.tasks.update(task.id, { status: done ? '未开始' : '已完成', progress: done ? 0 : 100, updatedAt: new Date().toISOString() });
  };
  return <div className="task-row">
    <button className={`check ${done ? 'done' : ''}`} onClick={toggle} aria-label={done ? '标记未完成' : '标记完成'}>{done && <Check size={15}/>}</button>
    <div><div className={`task-title ${done ? 'done' : ''}`}>{task.title}</div><div className="task-meta"><span>{task.startTime || '全天'}</span><span>{task.category}</span>{task.priority !== '普通' && <span>· {task.priority}</span>}</div></div>
    <span className={`badge ${done ? 'done' : task.priority === '高' || task.priority === '紧急' ? 'high' : ''}`}>{done ? '完成' : task.status}</span>
  </div>;
}
