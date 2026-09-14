import { useLiveQuery } from 'dexie-react-hooks';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { db } from '../db/database';
import { Card, EmptyState, PageHeader, Section } from '../components/ui';

export function EnglishMistakesPage(){
  const rows=useLiveQuery(()=>db.englishMistakes.orderBy('updatedAt').reverse().toArray(),[])??[];
  return <div className="page"><PageHeader title="错题本" subtitle="做错的题会自动进来。掌握以后可以标记完成。"/>
    {rows.length?<Section title={`全部错题 · ${rows.length}`}><div className="stack">{rows.map(m=><Card key={m.id}><div className="row between start"><div style={{flex:1}}><div className="eyebrow">{m.knowledgePoint} · 错过 {m.errorCount} 次</div><h2>{m.prompt}</h2><div className="subtle">你的答案：{m.userAnswer||'未作答'}</div><div style={{marginTop:8}}><strong>正确答案：{m.correctAnswer}</strong></div><div className="subtle" style={{marginTop:5}}>{m.explanation}</div></div><span className={`badge ${m.mastered?'done':'high'}`}>{m.mastered?'已掌握':'待复习'}</span></div><div className="row" style={{marginTop:12}}><button className="btn small" onClick={()=>db.englishMistakes.update(m.id,{mastered:!m.mastered,updatedAt:new Date().toISOString()})}><CheckCircle2 size={15}/>{m.mastered?'重新复习':'标记掌握'}</button><button className="btn ghost small" onClick={async()=>{if(confirm('从错题本移除这道题？'))await db.englishMistakes.delete(m.id)}}><Trash2 size={15}/>移出</button></div></Card>)}</div></Section>:<EmptyState title="错题本还是空的" text="在英语课程里做错题后，会自动记录到这里。"/>}
  </div>
}
