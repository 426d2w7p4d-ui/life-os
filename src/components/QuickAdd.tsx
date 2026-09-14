import { useState } from 'react';
import { Plus, CheckSquare2, WalletCards, StickyNote, BookOpen, Video, CalendarHeart, PawPrint, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddTaskForm } from './forms/AddTaskForm';

export function QuickAdd() {
  const [open, setOpen] = useState(false);
  const [taskForm, setTaskForm] = useState(false);
  const nav = useNavigate();
  const go = (path: string) => { setOpen(false); nav(path); };
  return <>
    <button className="fab" onClick={() => setOpen(true)} aria-label="快速添加"><Plus size={27}/></button>
    {open && <div className="overlay" onMouseDown={() => setOpen(false)}><div className="sheet" onMouseDown={e=>e.stopPropagation()}>
      <div className="sheet-handle" />
      <div className="row between"><div><h2 style={{marginBottom:3}}>快速添加</h2><div className="subtle">把想到的事立刻放进 Life OS</div></div><button className="icon-btn" onClick={()=>setOpen(false)}><X size={20}/></button></div>
      <div className="sheet-grid" style={{marginTop:16}}>
        <button className="sheet-action" onClick={()=>{setOpen(false);setTaskForm(true)}}><CheckSquare2 size={20}/>新建任务</button>
        <button className="sheet-action" onClick={()=>go('/finance')}><WalletCards size={20}/>记一笔</button>
        <button className="sheet-action" onClick={()=>go('/notes')}><StickyNote size={20}/>备忘录</button>
        <button className="sheet-action" onClick={()=>go('/courses')}><BookOpen size={20}/>添加课程</button>
        <button className="sheet-action" onClick={()=>go('/videos')}><Video size={20}/>添加视频</button>
        <button className="sheet-action" onClick={()=>go('/countdowns')}><CalendarHeart size={20}/>纪念日</button>
        <button className="sheet-action" onClick={()=>go('/pets')}><PawPrint size={20}/>宠物记录</button>
      </div>
    </div></div>}
    {taskForm && <AddTaskForm onClose={()=>setTaskForm(false)} />}
  </>;
}
