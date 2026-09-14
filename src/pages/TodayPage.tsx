import { useLiveQuery } from 'dexie-react-hooks';
import { Search, BookOpen, WalletCards, BriefcaseBusiness, PawPrint, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/database';
import { todayISO, formatDateCN, daysBetween } from '../utils/date';
import { Card, PageHeader, ProgressBar, Section } from '../components/ui';
import { TaskItem } from '../components/TaskItem';

export function TodayPage() {
  const nav=useNavigate(); const today=todayISO();
  const tasks=useLiveQuery(()=>db.tasks.where('date').equals(today).toArray(),[today])??[];
  const courses=useLiveQuery(()=>db.courses.where('weekday').equals(new Date().getDay()||7).toArray(),[])??[];
  const countdowns=useLiveQuery(()=>db.countdowns.toArray(),[])??[];
  const english=useLiveQuery(()=>db.englishRecords.where('date').equals(today).toArray(),[today])??[];
  const expenses=useLiveQuery(()=>db.expenses.where('date').equals(today).toArray(),[today])??[];
  const clients=useLiveQuery(()=>db.clients.where('status').equals('合作中').toArray(),[])??[];
  const videos=useLiveQuery(()=>db.videos.toArray(),[])??[];
  const petReminders=useLiveQuery(()=>db.petRecords.where('nextDate').equals(today).toArray(),[today])??[];
  const done=tasks.filter(t=>t.status==='已完成').length; const pct=tasks.length?Math.round(done/tasks.length*100):0;
  const spend=expenses.filter(e=>e.flow==='支出').reduce((s,e)=>s+e.amount,0);
  const engMinutes=english.reduce((s,e)=>s+e.minutes,0); const words=english.reduce((s,e)=>s+e.wordsLearned,0);
  const nextCountdown=[...countdowns].filter(c=>c.mode==='倒计时'&&daysBetween(c.date)>=0).sort((a,b)=>a.date.localeCompare(b.date))[0];
  const activeClient=clients[0]; const clientVideos=activeClient?videos.filter(v=>v.clientId===activeClient.id):[]; const pending=clientVideos.filter(v=>v.status!=='已发布').length;
  const nextCourse=[...courses].sort((a,b)=>a.startTime.localeCompare(b.startTime))[0];
  return <div className="page">
    <PageHeader eyebrow={formatDateCN()} title="今天" subtitle="把今天过清楚，就已经很不错。" action={<button className="icon-btn" onClick={()=>nav('/search')}><Search size={20}/></button>}/>
    <Card><div className="row between"><div><div className="eyebrow">今日完成度</div><div className="metric">{done} / {tasks.length}</div><div className="subtle" style={{marginTop:5}}>今天的安排正在一点点清空。</div></div><div className="ring" style={{'--p':pct} as React.CSSProperties}><span className="ring-value">{pct}%</span></div></div></Card>
    <Section title="今日任务" action={<button className="btn ghost small" onClick={()=>nav('/tasks')}>查看全部 <ChevronRight size={15}/></button>}>
      <Card>{tasks.length?tasks.slice(0,5).map(t=><TaskItem key={t.id} task={t}/>):<div className="empty"><strong>今天暂时没有安排</strong><span>点右下角 + 添加任务。</span></div>}</Card>
    </Section>
    <div className="grid two">
      <Card><div className="row start"><div className="icon-box primary"><BookOpen size={20}/></div><div style={{minWidth:0}}><div className="label">下一节课程</div><div style={{fontWeight:800,marginTop:4}}>{nextCourse?.name||'今天没有课程'}</div>{nextCourse&&<div className="subtle" style={{fontSize:12}}>{nextCourse.startTime} · {nextCourse.room||'未填教室'}</div>}</div></div></Card>
      <Card><div className="row start"><div className="icon-box orange"><WalletCards size={20}/></div><div><div className="label">今日消费</div><div className="metric small" style={{marginTop:4}}>¥{spend.toFixed(2)}</div><div className="subtle" style={{fontSize:12}}>点击进入记账</div></div></div></Card>
    </div>
    <Section title="今天的其他事情"><div className="grid two">
      <Card className="compact"><div className="label">今日英语</div><div className="metric small">{words} 词</div><div className="subtle">学习 {engMinutes} 分钟</div><div style={{marginTop:10}}><ProgressBar value={Math.min(100,words/30*100)}/></div></Card>
      <Card className="compact"><div className="label">最近倒数日</div><div className="metric small">{nextCountdown?`${daysBetween(nextCountdown.date)} 天`:'暂无'}</div><div className="subtle">{nextCountdown?.name||'添加一个重要日期'}</div></Card>
      <Card className="compact"><div className="row"><div className="icon-box"><BriefcaseBusiness size={18}/></div><div><div className="label">今日工作</div><div style={{fontWeight:800}}>{activeClient?.name||'暂无客户'}</div><div className="subtle" style={{fontSize:12}}>{activeClient?`还有 ${pending} 个视频任务`:'去工作台添加'}</div></div></div></Card>
      <Card className="compact"><div className="row"><div className="icon-box orange"><PawPrint size={18}/></div><div><div className="label">宠物提醒</div><div style={{fontWeight:800}}>{petReminders.length?`${petReminders.length} 个提醒`:'今天无提醒'}</div><div className="subtle" style={{fontSize:12}}>{petReminders[0]?.title||'记录疫苗、驱虫与体重'}</div></div></div></Card>
    </div></Section>
  </div>;
}
