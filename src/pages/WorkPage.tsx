import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart3, Columns3, PlayCircle, Plus, UsersRound, Video } from 'lucide-react';
import { db } from '../db/database';
import type { VideoStatus } from '../types/models';
import { Card, EmptyState, PageHeader, ProgressBar, Section } from '../components/ui';

const pipeline:VideoStatus[]=['文案','待拍','剪辑','审核','待发布','已发布'];

export function WorkPage(){
  const nav=useNavigate();
  const clients=useLiveQuery(()=>db.clients.toArray(),[])??[];
  const videos=useLiveQuery(()=>db.videos.toArray(),[])??[];
  const active=clients.find(c=>c.status==='合作中')??clients[0];
  const activeVideos=active?videos.filter(v=>v.clientId===active.id):[];
  const published=activeVideos.filter(v=>v.status==='已发布').length;
  const target=active?.promisedVideos||0;
  const contentMix=useMemo(()=>Object.entries(activeVideos.reduce<Record<string,number>>((acc,v)=>{acc[v.contentType]=(acc[v.contentType]||0)+1;return acc},{})).sort((a,b)=>b[1]-a[1]),[activeVideos]);
  return <div className="page"><PageHeader eyebrow="客户 · 项目 · 视频流水线" title="工作台" subtitle="把它当成一个完整的短视频运营工作台：客户交付、制作状态、内容结构和数据都集中在这里。" action={<button className="icon-btn" onClick={()=>nav('/clients?add=1')} aria-label="添加客户"><Plus size={20}/></button>}/>
    {active?<Card className="client-hero"><div className="row start"><div className="client-logo">{active.name.slice(0,2)}</div><div className="grow"><div className="row between start"><div><div className="eyebrow">当前合作客户</div><h2>{active.name}</h2><div className="subtle tiny">{active.platform} · {active.positioning||'未填写账号定位'}</div></div><span className="badge primary">{active.status}</span></div><div className="work-progress"><div className="row between"><strong>本期交付 {published} / {target||activeVideos.length}</strong><span className="subtle tiny">{target?Math.round(published/Math.max(1,target)*100):0}%</span></div><ProgressBar value={target?published/Math.max(1,target)*100:0}/></div><div className="work-actions"><button className="btn small" onClick={()=>nav('/videos?add=1')}><Video size={15}/>新建视频</button><button className="btn small softblue" onClick={()=>nav('/clients')}>客户档案</button></div></div></div></Card>:<EmptyState title="还没有客户" text="添加客户后，工作台会自动显示视频交付和制作进度。" action={<button className="btn primary" onClick={()=>nav('/clients?add=1')}>添加客户</button>}/>} 
    <Section title="制作流水线" action={<button className="text-btn" onClick={()=>nav('/videos?view=kanban')}>打开看板</button>}><div className="pipeline">{pipeline.map(s=><button className="pipe" key={s} onClick={()=>nav(`/videos?status=${encodeURIComponent(s)}`)}><b>{activeVideos.filter(v=>v.status===s).length}</b><span>{s}</span></button>)}</div></Section>
    <Section title="最近视频" action={<button className="text-btn" onClick={()=>nav('/videos')}>全部视频</button>}><Card>{activeVideos.length?activeVideos.slice().sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).slice(0,4).map(v=><button className="video-row clean-button" key={v.id} onClick={()=>nav('/videos')}><div className="row"><div className="record-ico"><PlayCircle size={18}/></div><div className="left"><strong className="small">#{v.index} {v.title}</strong><div className="subtle tiny">{v.contentType} · {v.platform||active?.platform}</div></div></div><span className={`badge ${v.status==='已发布'?'done':'primary'}`}>{v.status}</span></button>):<div className="empty"><strong>还没有视频</strong><span>创建一条视频后，这里会显示最新进度。</span></div>}</Card></Section>
    <Section title="内容结构"><Card><div className="content-mix">{contentMix.length?contentMix.map(([name,count])=><button className="stat-chip" key={name} onClick={()=>nav('/videos')}><b>{count}</b><span>{name}</span></button>):<div className="subtle">暂无内容分类数据。</div>}</div></Card></Section>
    <Section title="工作入口"><div className="grid two"><button className="card work-entry" onClick={()=>nav('/clients')}><UsersRound size={22}/><strong>客户管理</strong><span>档案、合作周期、约定视频量</span></button><button className="card work-entry" onClick={()=>nav('/videos')}><Video size={22}/><strong>视频项目</strong><span>文案、脚本、拍摄、发布与数据</span></button><button className="card work-entry" onClick={()=>nav('/videos?view=kanban')}><Columns3 size={22}/><strong>制作看板</strong><span>按状态推进整条生产流水线</span></button><button className="card work-entry" onClick={()=>nav('/videos')}><BarChart3 size={22}/><strong>内容分析</strong><span>科普、案例、剧情等内容占比</span></button></div></Section>
  </div>
}
