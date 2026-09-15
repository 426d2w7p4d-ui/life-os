import { useNavigate } from 'react-router-dom';
import { BookOpen, Languages, CalendarHeart, Trophy, ChevronRight } from 'lucide-react';
import { Card, PageHeader, ProgressBar, Section } from '../components/ui';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { todayISO } from '../utils/date';
import { CourseRadar } from '../components/CourseRadar';

export function LearningPage(){
  const nav=useNavigate();const today=todayISO();
  const records=useLiveQuery(()=>db.englishRecords.where('date').equals(today).toArray(),[today])??[];
  const courses=useLiveQuery(()=>db.courses.toArray(),[])??[];
  const mins=records.reduce((s,r)=>s+r.minutes,0);
  return <div className="page"><PageHeader eyebrow="课程 · 英语 · 考试" title="学习" subtitle="先看现在的课程，再管理课程表、作业和长期学习。"/>
    <CourseRadar courses={courses} variant="light"/>
    <div className="section"><Card className="study-summary"><div className="row between"><div><div className="eyebrow">今日学习</div><div className="metric">{mins} 分钟</div><div className="subtle">建议目标 30 分钟</div></div><div style={{width:120}}><ProgressBar value={Math.min(100,mins/30*100)}/></div></div></Card></div>
    <Section title="学习中心"><Card>{[[BookOpen,'我的课程','整周课表、实时课程、作业与考试','/courses'],[Languages,'英语学习中心','从零基础到 CET-6','/english'],[CalendarHeart,'纪念日与考试','考试倒数和重要日期','/countdowns'],[Trophy,'奖励中心','用星星兑换现实奖励','/rewards']].map(([Icon,title,sub,path])=>{const I=Icon as typeof BookOpen;return <button key={String(path)} className="list-link clean-button" onClick={()=>nav(String(path))}><div className="row"><div className="icon-box primary"><I size={19}/></div><div className="left"><strong>{String(title)}</strong><div className="subtle tiny">{String(sub)}</div></div></div><ChevronRight size={18} color="#a2a7b0"/></button>})}</Card></Section>
  </div>
}
