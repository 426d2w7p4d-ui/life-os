import { useLiveQuery } from 'dexie-react-hooks';
import { Search, BookOpen, WalletCards, BriefcaseBusiness, PawPrint, ChevronRight, CalendarDays, Heart, GraduationCap, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/database';
import { todayISO, formatDateCN, daysBetween } from '../utils/date';
import { Card, PageHeader, ProgressBar, Section } from '../components/ui';
import { TaskItem } from '../components/TaskItem';
import { CourseRadar } from '../components/CourseRadar';

export function TodayPage() {
  const nav=useNavigate(); const today=todayISO();
  const tasks=useLiveQuery(()=>db.tasks.where('date').equals(today).toArray(),[today])??[];
  const courses=useLiveQuery(()=>db.courses.toArray(),[])??[];
  const countdowns=useLiveQuery(()=>db.countdowns.toArray(),[])??[];
  const english=useLiveQuery(()=>db.englishRecords.where('date').equals(today).toArray(),[today])??[];
  const expenses=useLiveQuery(()=>db.expenses.where('date').equals(today).toArray(),[today])??[];
  const clients=useLiveQuery(()=>db.clients.where('status').equals('合作中').toArray(),[])??[];
  const videos=useLiveQuery(()=>db.videos.toArray(),[])??[];
  const petReminders=useLiveQuery(()=>db.petRecords.where('nextDate').equals(today).toArray(),[today])??[];
  const done=tasks.filter(t=>t.status==='已完成').length; const pct=tasks.length?Math.round(done/tasks.length*100):0;
  const spend=expenses.filter(e=>e.flow==='支出').reduce((s,e)=>s+e.amount,0);
  const engMinutes=english.reduce((s,e)=>s+e.minutes,0); const words=english.reduce((s,e)=>s+e.wordsLearned,0);
  const nextCountdown=[...countdowns].filter(c=>daysBetween(c.date)>=0).sort((a,b)=>a.date.localeCompare(b.date))[0];
  const activeClient=clients[0]; const clientVideos=activeClient?videos.filter(v=>v.clientId===activeClient.id):[]; const pending=clientVideos.filter(v=>v.status!=='已发布').length;
  return <div className="page">
    <PageHeader eyebrow={formatDateCN()} title="今天" subtitle="先看现在该做什么，再看今天还剩什么。" action={<button className="icon-btn" onClick={()=>nav('/search')} aria-label="全局搜索"><Search size={20}/></button>}/>
    <CourseRadar courses={courses}/>
    <div className="section"><Card className="hero-completion"><div><div className="eyebrow">今日完成度</div><div className="metric">{done} / {tasks.length}</div><div className="subtle">今天的安排正在一点点清空。</div><button className="text-btn" onClick={()=>nav('/tasks')}>查看今天任务 →</button></div><div className="ring" style={{'--p':pct} as React.CSSProperties}><span className="ring-value">{pct}%</span></div></Card></div>
    <Section title="快速进入"><div className="quick-grid"><button className="quick" onClick={()=>nav('/calendar')}><CalendarDays size={21}/><span>日历</span></button><button className="quick" onClick={()=>nav('/courses')}><GraduationCap size={21}/><span>课程</span></button><button className="quick" onClick={()=>nav('/countdowns')}><Heart size={21}/><span>纪念日</span></button><button className="quick" onClick={()=>nav('/pets')}><PawPrint size={21}/><span>宠物</span></button></div></Section>
    <Section title="今日任务" action={<button className="btn ghost small" onClick={()=>nav('/tasks')}>查看全部 <ChevronRight size={15}/></button>}><Card>{tasks.length?tasks.slice(0,5).map(t=><TaskItem key={t.id} task={t}/>):<div className="empty"><strong>今天暂时没有安排</strong><span>点右下角 + 添加任务。</span></div>}</Card></Section>
    <Section title="今天的其他事情"><div className="grid two">
      <button className="card clickable-card" onClick={()=>nav('/english')}><div className="row start"><div className="icon-box primary"><BookOpen size={19}/></div><div><div className="label">今日英语</div><div className="metric small">{words} 词</div><div className="subtle tiny">学习 {engMinutes} 分钟</div></div></div><div className="progress-wrap"><ProgressBar value={Math.min(100,words/30*100)}/></div></button>
      <button className="card clickable-card" onClick={()=>nav('/finance')}><div className="row start"><div className="icon-box orange"><WalletCards size={19}/></div><div><div className="label">今日消费</div><div className="metric small">¥{spend.toFixed(2)}</div><div className="subtle tiny">进入记账</div></div></div></button>
      <button className="card clickable-card" onClick={()=>nav('/work')}><div className="row start"><div className="icon-box"><BriefcaseBusiness size={19}/></div><div><div className="label">今日工作</div><strong>{activeClient?.name||'暂无客户'}</strong><div className="subtle tiny">{activeClient?`还有 ${pending} 个视频任务`:'去工作台添加'}</div></div></div></button>
      <button className="card clickable-card" onClick={()=>nav('/countdowns')}><div className="row start"><div className="icon-box red"><Heart size={19}/></div><div><div className="label">最近重要日</div><div className="metric small">{nextCountdown?`${Math.abs(daysBetween(nextCountdown.date))} 天`:'暂无'}</div><div className="subtle tiny">{nextCountdown?.name||'添加重要日期'}</div></div></div></button>
      <button className="card clickable-card" onClick={()=>nav('/pets')}><div className="row start"><div className="icon-box green"><PawPrint size={19}/></div><div><div className="label">宠物提醒</div><strong>{petReminders.length?`${petReminders.length} 个提醒`:'今天无提醒'}</strong><div className="subtle tiny">{petReminders[0]?.title||'健康档案与护理记录'}</div></div></div></button>
      <button className="card clickable-card" onClick={()=>nav('/videos')}><div className="row start"><div className="icon-box primary"><Video size={19}/></div><div><div className="label">视频项目</div><strong>{videos.filter(v=>v.status==='已发布').length} 条已发布</strong><div className="subtle tiny">继续推进制作流水线</div></div></div></button>
    </div></Section>
  </div>;
}
