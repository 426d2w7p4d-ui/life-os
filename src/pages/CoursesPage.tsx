import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BookOpenCheck, ClipboardPlus, Edit3, FileUp, Plus, Trash2, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../db/database';
import { uid } from '../utils/id';
import { todayISO } from '../utils/date';
import { filesToAttachments } from '../utils/files';
import type { Attachment, Course } from '../types/models';
import { Card, EmptyState, PageHeader, Section } from '../components/ui';
import { CourseRadar } from '../components/CourseRadar';

type CourseView='week'|'today'|'pick';
const weekNames=['','一','二','三','四','五','六','日'];
const palette=['#6f82ef','#ce7898','#4b9a77','#d18653','#8c71d6','#5f9ca1'];

export function CoursesPage(){
  const courses=useLiveQuery(()=>db.courses.toArray(),[])??[];
  const [params,setParams]=useSearchParams();
  const [view,setView]=useState<CourseView>('week');
  const [pickDay,setPickDay]=useState(new Date().getDay()||7);
  const [editing,setEditing]=useState<Course|null>(null);
  const [homeworkCourse,setHomeworkCourse]=useState<Course|null>(null);
  const [add,setAdd]=useState(false);
  useEffect(()=>{if(params.get('add')==='1'){setAdd(true);setParams({}, {replace:true})}},[params,setParams]);
  const sorted=useMemo(()=>[...courses].sort((a,b)=>a.weekday-b.weekday||a.startTime.localeCompare(b.startTime)),[courses]);
  const todayWd=new Date().getDay()||7;
  return <div className="page"><PageHeader eyebrow="课程表 · 作业 · 考试" title="我的课程" subtitle="一屏看整周，也可以只看今天或指定星期；课程会自动进入实时课程助手。" action={<button className="icon-btn" onClick={()=>setAdd(true)} aria-label="添加课程"><Plus size={20}/></button>}/>
    <CourseRadar courses={courses} variant="light"/>
    <div className="section"><div className="segment">{([['week','周课表'],['today','今天'],['pick','按星期']] as const).map(([v,label])=><button key={v} className={view===v?'active':''} onClick={()=>setView(v)}>{label}</button>)}</div></div>
    {view==='week'&&<WeekSchedule courses={sorted} onCourse={setEditing}/>} 
    {view==='today'&&<DaySchedule day={todayWd} courses={sorted} onCourse={setEditing}/>} 
    {view==='pick'&&<><div className="day-selector">{[1,2,3,4,5,6,7].map(d=><button className={`day-pill ${pickDay===d?'active':''}`} key={d} onClick={()=>setPickDay(d)}>周<b>{weekNames[d]}</b></button>)}</div><DaySchedule day={pickDay} courses={sorted} onCourse={setEditing}/></>}
    <div className="swipe-hint">点课程可以编辑详情或创建作业 · 右上角 ＋ 添加课程</div>
    <Section title="课程管理" action={<button className="text-btn" onClick={()=>setAdd(true)}>＋ 添加</button>}><div className="stack">{sorted.length?sorted.map(c=><Card key={c.id}><div className="row between start"><div className="course-manager-main"><span className="course-color" style={{background:c.color}}/><div><div className="eyebrow">周{weekNames[c.weekday]} · {c.startTime}–{c.endTime}</div><h2>{c.name}</h2><div className="subtle">{c.teacher||'未填教师'} · {c.room||'未填教室'} · 第 {c.startWeek}–{c.endWeek} 周 · {c.weekType}</div>{c.examDate&&<span className="badge high">考试 {c.examDate}</span>}</div></div><div className="course-actions"><button className="icon-btn small-icon" onClick={()=>setHomeworkCourse(c)} aria-label="添加作业"><ClipboardPlus size={16}/></button><button className="icon-btn small-icon" onClick={()=>setEditing(c)} aria-label="编辑课程"><Edit3 size={16}/></button></div></div></Card>):<EmptyState title="还没有课程" text="添加课程后，就能看到完整周课表和实时课程提醒。"/>}</div></Section>
    {(add||editing)&&<CourseForm course={editing} onClose={()=>{setAdd(false);setEditing(null)}}/>}
    {homeworkCourse&&<HomeworkForm course={homeworkCourse} onClose={()=>setHomeworkCourse(null)}/>} 
  </div>
}

function WeekSchedule({courses,onCourse}:{courses:Course[];onCourse:(c:Course)=>void}){
  const slots=useMemo(()=>Array.from(new Set(courses.map(c=>`${c.startTime}|${c.endTime}`))).sort(),[courses]);
  if(!courses.length)return <EmptyState title="这一周还没有课程" text="点右上角 ＋ 添加第一门课程。"/>;
  return <div className="course-table"><div className="ct-head"><div>节次</div>{[1,2,3,4,5,6,7].map(d=><div key={d}>周{weekNames[d]}</div>)}</div>{slots.map((slot,i)=>{const [start,end]=slot.split('|');return <div className="ct-row" key={slot}><div className="period">{i+1}<small>{start}</small></div>{[1,2,3,4,5,6,7].map(day=>{const c=courses.find(x=>x.weekday===day&&x.startTime===start&&x.endTime===end);return <div key={day}>{c&&<button className="course-block" style={{background:`${c.color}18`,color:c.color}} onClick={()=>onCourse(c)}><b>{c.name}</b><small>{c.room||'未填教室'}</small></button>}</div>})}</div>})}</div>
}

function DaySchedule({day,courses,onCourse}:{day:number;courses:Course[];onCourse:(c:Course)=>void}){
  const dayCourses=courses.filter(c=>c.weekday===day);
  return <div className="day-course-list">{dayCourses.length?dayCourses.map(c=><button className="day-course-card" key={c.id} onClick={()=>onCourse(c)}><span className="course-color" style={{background:c.color}}/><div className="grow"><div className="eyebrow">{c.startTime}–{c.endTime} · {c.room||'未填教室'}</div><strong>{c.name}</strong><div className="subtle tiny">{c.teacher||'未填教师'} · 第 {c.startWeek}–{c.endWeek} 周</div></div><span>›</span></button>):<EmptyState title={`周${weekNames[day]}没有课程`} text="这一天可以安排自习、复盘或者休息。"/>}</div>
}

function CourseForm({course,onClose}:{course:Course|null;onClose:()=>void}){
  const [name,setName]=useState(course?.name||'');const [teacher,setTeacher]=useState(course?.teacher||'');const [room,setRoom]=useState(course?.room||'');const [weekday,setWeekday]=useState(course?.weekday||(new Date().getDay()||7));const [start,setStart]=useState(course?.startTime||'09:00');const [end,setEnd]=useState(course?.endTime||'10:30');const [startWeek,setStartWeek]=useState(course?.startWeek||1);const [endWeek,setEndWeek]=useState(course?.endWeek||18);const [weekType,setWeekType]=useState<Course['weekType']>(course?.weekType||'全部');const [examDate,setExamDate]=useState(course?.examDate||'');const [notes,setNotes]=useState(course?.notes||'');const [color,setColor]=useState(course?.color||palette[0]);const [saving,setSaving]=useState(false);
  const save=async()=>{if(!name.trim()||start>=end)return;setSaving(true);const now=new Date().toISOString();const data={name:name.trim(),teacher:teacher.trim()||undefined,room:room.trim()||undefined,weekday,startTime:start,endTime:end,startWeek,endWeek,weekType,examDate:examDate||undefined,notes:notes.trim()||undefined,color,updatedAt:now};if(course)await db.courses.update(course.id,data);else await db.courses.add({id:uid(),createdAt:now,...data});setSaving(false);onClose()};
  return <div className="overlay" onMouseDown={onClose}><div className="sheet" onMouseDown={e=>e.stopPropagation()}><div className="sheet-handle"/><div className="row between"><div><h2>{course?'编辑课程':'添加课程'}</h2><div className="subtle tiny">教师、教室、周次和考试都可以完整记录。</div></div><button className="icon-btn" onClick={onClose}><X size={20}/></button></div><div className="stack form-stack"><div className="field"><label>课程名称 *</label><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="例如：大学英语"/></div><div className="grid two"><div className="field"><label>教师</label><input className="input" value={teacher} onChange={e=>setTeacher(e.target.value)} placeholder="王老师"/></div><div className="field"><label>教室</label><input className="input" value={room} onChange={e=>setRoom(e.target.value)} placeholder="A302"/></div></div><div className="grid two"><div className="field"><label>星期</label><select className="select" value={weekday} onChange={e=>setWeekday(Number(e.target.value))}>{[1,2,3,4,5,6,7].map(n=><option key={n} value={n}>周{weekNames[n]}</option>)}</select></div><div className="field"><label>单双周</label><select className="select" value={weekType} onChange={e=>setWeekType(e.target.value as Course['weekType'])}><option>全部</option><option>单周</option><option>双周</option></select></div></div><div className="grid two"><div className="field"><label>开始时间</label><input className="input" type="time" value={start} onChange={e=>setStart(e.target.value)}/></div><div className="field"><label>结束时间</label><input className="input" type="time" value={end} onChange={e=>setEnd(e.target.value)}/></div></div><div className="grid two"><div className="field"><label>开始周</label><input className="input" type="number" min="1" value={startWeek} onChange={e=>setStartWeek(Number(e.target.value))}/></div><div className="field"><label>结束周</label><input className="input" type="number" min="1" value={endWeek} onChange={e=>setEndWeek(Number(e.target.value))}/></div></div><div className="field"><label>考试日期</label><input className="input" type="date" value={examDate} onChange={e=>setExamDate(e.target.value)}/></div><div className="field"><label>课程颜色</label><div className="color-picker">{palette.map(x=><button key={x} className={color===x?'selected':''} style={{background:x}} onClick={()=>setColor(x)} aria-label={`选择颜色 ${x}`}/>)}</div></div><div className="field"><label>备注</label><textarea className="textarea" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="课程要求、教材、考试说明……"/></div>{course&&<button className="btn danger" onClick={async()=>{if(confirm(`删除课程“${course.name}”？已生成的历史任务不会被删除。`)){await db.courses.delete(course.id);onClose()}}}><Trash2 size={16}/>删除课程</button>}<button className="btn primary" disabled={!name.trim()||start>=end||saving} onClick={save}>{saving?'保存中…':'保存课程'}</button></div></div></div>
}

function HomeworkForm({course,onClose}:{course:Course;onClose:()=>void}){
  const [title,setTitle]=useState('');const [description,setDescription]=useState('');const [deadline,setDeadline]=useState(todayISO());const [attachments,setAttachments]=useState<Attachment[]>([]);const [saving,setSaving]=useState(false);
  const save=async()=>{if(!title.trim())return;setSaving(true);const cal=(await db.calendars.where('name').equals('学习').first())??(await db.calendars.toCollection().first());if(!cal){setSaving(false);return}const now=new Date().toISOString();await db.tasks.add({id:uid(),title:title.trim(),description:description.trim()||undefined,calendarId:cal.id,category:'课程作业',tags:[course.name],date:deadline,deadline,priority:'普通',status:'未开始',progress:0,subtasks:[],attachments,sourceType:'course',sourceId:course.id,createdAt:now,updatedAt:now});setSaving(false);onClose()};
  return <div className="overlay" onMouseDown={onClose}><div className="sheet" onMouseDown={e=>e.stopPropagation()}><div className="sheet-handle"/><div className="row between"><div><h2>添加课程作业</h2><div className="subtle tiny">{course.name} · 作业会自动进入学习日历</div></div><button className="icon-btn" onClick={onClose}><X size={20}/></button></div><div className="stack form-stack"><div className="field"><label>作业名称 *</label><input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="例如：完成 Unit 3 练习"/></div><div className="field"><label>作业要求 / 文字说明</label><textarea className="textarea" value={description} onChange={e=>setDescription(e.target.value)} placeholder="老师要求、题目范围、注意事项……"/></div><div className="field"><label>截止日期</label><input className="input" type="date" value={deadline} onChange={e=>setDeadline(e.target.value)}/></div><label className="upload-zone"><FileUp size={20}/><span>上传图片 / PDF / 文件</span><small>小于 2.5MB 的文件会随本地备份保存</small><input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={async e=>e.target.files&&setAttachments(await filesToAttachments(e.target.files))}/></label>{attachments.length>0&&<div className="attachment-list">{attachments.map(a=><span key={a.id}>{a.name}</span>)}</div>}<button className="btn primary" disabled={!title.trim()||saving} onClick={save}><BookOpenCheck size={17}/>{saving?'保存中…':'保存作业'}</button></div></div></div>
}
