import { CalendarDays, Database, Smartphone } from 'lucide-react';
import { db } from '../db/database';
import { ensureSeedData } from '../db/seed';
import { uid } from '../utils/id';

async function createBlankBase(){if(await db.calendars.count())return;const now=new Date().toISOString();await db.calendars.bulkAdd([
{id:uid(),name:'学习',color:'#6f86ff',icon:'BookOpen',order:1,hidden:false,archived:false,createdAt:now},
{id:uid(),name:'工作',color:'#8b75d7',icon:'Briefcase',order:2,hidden:false,archived:false,createdAt:now},
{id:uid(),name:'生活',color:'#5e9d7f',icon:'Home',order:3,hidden:false,archived:false,createdAt:now},
{id:uid(),name:'宠物',color:'#d58a54',icon:'PawPrint',order:4,hidden:false,archived:false,createdAt:now},
{id:uid(),name:'短视频',color:'#6477a8',icon:'Video',order:5,hidden:false,archived:false,createdAt:now}])}
export function OnboardingPage({onDone}:{onDone:()=>void}){const finish=async(demo:boolean)=>{if(demo)await ensureSeedData();else await createBlankBase();localStorage.setItem('life-os-onboarded','1');onDone()};return <div className="page" style={{paddingTop:'max(50px, env(safe-area-inset-top))'}}><div className="eyebrow">欢迎来到</div><h1 style={{fontSize:42}}>Life OS</h1><p className="subtle" style={{fontSize:16,maxWidth:520}}>不是另一个 Todo List。它把你的任务、课程、英语、工作、宠物、记账和复盘收进同一个生活操作系统。</p><div className="section stack"><div className="card row start"><div className="icon-box primary"><CalendarDays/></div><div><strong>先看今天</strong><div className="subtle">每天打开以后，先知道今天该做什么。</div></div></div><div className="card row start"><div className="icon-box green"><Database/></div><div><strong>数据留在本机</strong><div className="subtle">第一版使用 IndexedDB，不依赖账号和云端。</div></div></div><div className="card row start"><div className="icon-box orange"><Smartphone/></div><div><strong>像 App 一样使用</strong><div className="subtle">可以添加到手机主屏幕，支持 PWA。</div></div></div></div><div className="stack"><button className="btn primary" onClick={()=>void finish(true)}>先看看完整示例</button><button className="btn" onClick={()=>void finish(false)}>从空白开始</button></div></div>}
