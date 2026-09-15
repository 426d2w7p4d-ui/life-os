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
      <div className="row between"><div><h2>快速添加</h2><div className="subtle tiny">想到什么，直接放进对应模块。</div></div><button className="icon-btn" onClick={()=>setOpen(false)}><X size={20}/></button></div>
      <div className="sheet-grid form-stack">
        <button className="sheet-action" onClick={()=>{setOpen(false);setTaskForm(true)}}><CheckSquare2 size={20}/>新建任务</button>
        <button className="sheet-action" onClick={()=>go('/finance')}><WalletCards size={20}/>记一笔</button>
        <button className="sheet-action" onClick={()=>go('/notes')}><StickyNote size={20}/>备忘录</button>
        <button className="sheet-action" onClick={()=>go('/courses?add=1')}><BookOpen size={20}/>添加课程</button>
        <button className="sheet-action" onClick={()=>go('/videos?add=1')}><Video size={20}/>添加视频</button>
        <button className="sheet-action" onClick={()=>go('/countdowns?add=1')}><CalendarHeart size={20}/>纪念日</button>
        <button className="sheet-action" onClick={()=>go('/pets?record=1')}><PawPrint size={20}/>宠物记录</button>
      </div>
    </div></div>}
    {taskForm && <AddTaskForm onClose={()=>setTaskForm(false)} />}
  </>;
}
