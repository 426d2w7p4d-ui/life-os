import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Trash2 } from 'lucide-react';
import { db } from '../db/database';
import { uid } from '../utils/id';
import type { VocabularyWord } from '../types/models';
import { Card, EmptyState, PageHeader, Section } from '../components/ui';

export function VocabularyPage(){
  const words=useLiveQuery(()=>db.vocabulary.orderBy('createdAt').reverse().toArray(),[])??[];
  const [word,setWord]=useState(''); const [meaning,setMeaning]=useState(''); const [phonetic,setPhonetic]=useState('');
  const add=async()=>{if(!word.trim()||!meaning.trim())return;await db.vocabulary.add({id:uid(),word:word.trim(),phonetic:phonetic.trim()||undefined,meaning:meaning.trim(),familiarity:'不认识',createdAt:new Date().toISOString()});setWord('');setMeaning('');setPhonetic('')};
  const setFam=(id:string,familiarity:VocabularyWord['familiarity'])=>db.vocabulary.update(id,{familiarity});
  return <div className="page"><PageHeader title="生词本" subtitle="把遇到的新词留下来，再按熟悉程度复习。"/><Card><div className="grid two"><div className="field"><label>单词</label><input className="input" value={word} onChange={e=>setWord(e.target.value)} placeholder="example"/></div><div className="field"><label>音标（可选）</label><input className="input" value={phonetic} onChange={e=>setPhonetic(e.target.value)} placeholder="/ɪɡˈzɑːmpəl/"/></div></div><div className="field" style={{marginTop:10}}><label>中文意思</label><input className="input" value={meaning} onChange={e=>setMeaning(e.target.value)} placeholder="例子；示例"/></div><button className="btn primary" style={{width:'100%',marginTop:12}} onClick={add}><Plus size={17}/>加入生词本</button></Card>{words.length?<Section title={`我的单词 · ${words.length}`}><div className="stack">{words.map(w=><Card key={w.id}><div className="row between start"><div><h2 style={{marginBottom:3}}>{w.word}</h2>{w.phonetic&&<div className="subtle">{w.phonetic}</div>}<div style={{marginTop:6}}>{w.meaning}</div></div><button className="btn ghost small" onClick={async()=>{if(confirm(`删除 ${w.word}？`))await db.vocabulary.delete(w.id)}}><Trash2 size={15}/></button></div><div className="tabs" style={{marginTop:12}}>{(['认识','模糊','不认识'] as const).map(x=><button key={x} className={`tab ${w.familiarity===x?'active':''}`} onClick={()=>setFam(w.id,x)}>{x}</button>)}</div></Card>)}</div></Section>:<EmptyState title="还没有生词" text="遇到不会的词，就先放进这里。"/>}</div>
}
