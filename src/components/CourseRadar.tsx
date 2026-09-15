import { useEffect, useMemo, useState } from 'react';
import type { Course } from '../types/models';
import { formatDuration, minutesFromTime } from '../utils/date';

function weekdayCN(n:number){return ['日','一','二','三','四','五','六','日'][n]}

function getStatus(courses: Course[], now: Date){
  const jsDay = now.getDay();
  const todayWd = jsDay === 0 ? 7 : jsDay;
  const nowMin = now.getHours()*60 + now.getMinutes() + now.getSeconds()/60;
  const todayCourses = courses.filter(c=>c.weekday===todayWd).sort((a,b)=>a.startTime.localeCompare(b.startTime));
  const current = todayCourses.find(c=>nowMin>=minutesFromTime(c.startTime)&&nowMin<minutesFromTime(c.endTime));
  if(current){
    const start=minutesFromTime(current.startTime), end=minutesFromTime(current.endTime);
    const next=todayCourses.find(c=>minutesFromTime(c.startTime)>=end);
    return {kind:'current' as const,current,next,endDiff:end-nowMin,progress:(nowMin-start)/(end-start)*100,dayOffset:0};
  }
  const nextToday=todayCourses.find(c=>minutesFromTime(c.startTime)>nowMin);
  if(nextToday){return {kind:'next' as const,next:nextToday,nextDiff:minutesFromTime(nextToday.startTime)-nowMin,dayOffset:0}}
  for(let offset=1;offset<=7;offset++){
    const wd=((todayWd-1+offset)%7)+1;
    const next=courses.filter(c=>c.weekday===wd).sort((a,b)=>a.startTime.localeCompare(b.startTime))[0];
    if(next){
      const diff=offset*1440-nowMin+minutesFromTime(next.startTime);
      return {kind:'next' as const,next,nextDiff:diff,dayOffset:offset};
    }
  }
  return {kind:'empty' as const};
}

export function CourseRadar({courses,variant='dark'}:{courses:Course[];variant?:'dark'|'light'}){
  const [now,setNow]=useState(()=>new Date());
  const [message,setMessage]=useState('');
  useEffect(()=>{const id=window.setInterval(()=>setNow(new Date()),30000);return()=>window.clearInterval(id)},[]);
  const status=useMemo(()=>getStatus(courses,now),[courses,now]);
  const clock=now.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false});

  useEffect(()=>{
    if(localStorage.getItem('life-os-course-reminders')!=='1') return;
    const notify=(key:string,title:string,body:string)=>{
      if(localStorage.getItem(key)==='1') return;
      localStorage.setItem(key,'1'); setMessage(body); window.setTimeout(()=>setMessage(''),3500);
      if('Notification' in window && Notification.permission==='granted'){
        try{new Notification(title,{body,icon:'./icon-192.png'})}catch{/* iOS browser may restrict direct notifications */}
      }
    };
    const dayKey=`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
    if(status.kind==='next' && status.dayOffset===0 && status.nextDiff<=15 && status.nextDiff>14){
      notify(`life-os-remind-${dayKey}-${status.next.id}-start`,`${status.next.name} 快上课了`,`还有约 15 分钟上课 · ${status.next.room||'未填教室'}`);
    }
    if(status.kind==='current' && status.endDiff<=5 && status.endDiff>4){
      notify(`life-os-remind-${dayKey}-${status.current.id}-end`,`${status.current.name} 快下课了`,`还有约 5 分钟下课`);
    }
  },[status,now]);

  const remind=async()=>{
    localStorage.setItem('life-os-course-reminders','1');
    if('Notification' in window){
      try{
        const p=await Notification.requestPermission();
        setMessage(p==='granted'?'课程提醒已开启':'已记住提醒偏好；系统通知权限未开启');
      }catch{setMessage('已记住提醒偏好')}
    }else setMessage('已记住提醒偏好');
    window.setTimeout(()=>setMessage(''),2500);
  };

  return <div className={`card course-radar ${variant==='light'?'study-radar':''}`}>
    <div className="radar-inner">
      <div className="radar-top"><span className="radar-live"><i className="live-dot"/>实时课程助手</span><span className="radar-clock">现在 {clock}</span></div>
      {status.kind==='current' && <>
        <div className="radar-label">正在上课 · {status.current.startTime}–{status.current.endTime}</div>
        <div className="radar-course">{status.current.name}</div>
        <div className="radar-meta">{status.current.room||'未填教室'} · {status.current.teacher||'未填教师'}</div>
        <div className="radar-countdown">还有 {formatDuration(status.endDiff)} 下课</div>
        <div className="radar-progress"><i style={{width:`${Math.min(100,Math.max(0,status.progress))}%`}}/></div>
        <div className="radar-next"><div className="radar-next-main">{status.next?'下节课':'今天后面没有课了'}<b>{status.next?`${status.next.startTime} · ${status.next.name} · ${status.next.room||'未填教室'}`:'下课后可以安排自己的时间'}</b></div><button className="radar-pill" onClick={remind}>提醒我</button></div>
      </>}
      {status.kind==='next' && <>
        <div className="radar-label">{status.dayOffset?'下一次课程':'下一节课'} · {status.dayOffset?`周${weekdayCN(status.next.weekday)} `:''}{status.next.startTime}</div>
        <div className="radar-course">{status.next.name}</div>
        <div className="radar-meta">{status.next.room||'未填教室'} · {status.next.teacher||'未填教师'}</div>
        <div className="radar-countdown">还有 {formatDuration(status.nextDiff)} 上课</div>
        <div className="radar-progress"><i style={{width:'0%'}}/></div>
        <div className="radar-next"><div className="radar-next-main">智能判断当前时间<b>{status.dayOffset?'今天课程已结束':'到点后会自动切换成「正在上课」'}</b></div><button className="radar-pill" onClick={remind}>提醒我</button></div>
      </>}
      {status.kind==='empty' && <><div className="radar-label">还没有课程安排</div><div className="radar-course">自由安排时间</div><div className="radar-meta">添加课程后，这里会自动根据当前时间更新。</div></>}
      {message&&<div className="radar-message">{message}</div>}
    </div>
  </div>
}
