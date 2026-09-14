import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { allLessons } from '../features/english/curriculum';
import { Card, PageHeader, ProgressBar, Section } from '../components/ui';
import { db } from '../db/database';
import { uid } from '../utils/id';
import { todayISO } from '../utils/date';

export function EnglishLessonPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const lesson = useMemo(() => allLessons.find(l => l.id === id), [id]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!lesson) {
    return <div className="page"><PageHeader title="课程不存在" /><button className="btn" onClick={() => nav('/english')}>返回英语中心</button></div>;
  }

  const correct = lesson.questions.filter(q => answers[q.id] === q.answer).length;
  const score = lesson.questions.length ? Math.round(correct / lesson.questions.length * 100) : 100;

  const submit = async () => {
    setSubmitted(true);
    const now = new Date().toISOString();
    await db.englishRecords.add({
      id: uid(), date: todayISO(), minutes: lesson.minutes,
      wordsLearned: Math.max(5, lesson.examples.length * 3),
      lessonId: lesson.id, score, createdAt: now
    });
    for (const q of lesson.questions) {
      if (answers[q.id] === q.answer) continue;
      const existing = await db.englishMistakes.where('questionId').equals(q.id).first();
      if (existing) {
        await db.englishMistakes.update(existing.id, {
          userAnswer: answers[q.id] || '未作答', errorCount: existing.errorCount + 1,
          mastered: false, updatedAt: now
        });
      } else {
        await db.englishMistakes.add({
          id: uid(), questionId: q.id, prompt: q.prompt, correctAnswer: q.answer,
          userAnswer: answers[q.id] || '未作答', explanation: q.explanation,
          knowledgePoint: lesson.title, errorCount: 1, mastered: false, updatedAt: now
        });
      }
    }
  };

  return <div className="page">
    <PageHeader eyebrow="一节英语课" title={lesson.title} subtitle={`${lesson.minutes} 分钟 · 先例句，再规则，再练习`} action={<button className="icon-btn" onClick={() => nav('/english')}><ArrowLeft size={20} /></button>} />
    <Card><h2>先听老师怎么讲</h2><p className="subtle" style={{ fontSize: 15, color: '#424853' }}>{lesson.intro}</p></Card>
    <Section title="简单例句"><div className="stack">{lesson.examples.map((e, i) => <Card key={i} className="compact"><strong>{e.en}</strong><div className="subtle" style={{ marginTop: 5 }}>{e.zh}</div></Card>)}</div></Section>
    <Card><div className="eyebrow">记住这一条就够了</div><strong>{lesson.rule}</strong></Card>
    <Section title="练一练"><div className="stack">
      {lesson.questions.map((q, idx) => <Card key={q.id}>
        <h3>{idx + 1}. {q.prompt}</h3>
        <div className="stack">{q.options?.map(opt => <button key={opt} className={`btn ${answers[q.id] === opt ? 'primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: opt }))}>{opt}</button>)}</div>
        {submitted && <div style={{ marginTop: 12 }}>
          {answers[q.id] === q.answer
            ? <div className="row" style={{ color: 'var(--green)' }}><CheckCircle2 size={18} /><strong>答对了</strong></div>
            : <div><div className="row" style={{ color: 'var(--red)' }}><XCircle size={18} /><strong>正确答案：{q.answer}</strong></div><div className="subtle" style={{ marginTop: 6 }}>{q.explanation}</div></div>}
        </div>}
      </Card>)}
    </div></Section>
    {submitted
      ? <Card><div className="row between"><div><div className="label">本节掌握度</div><div className="metric">{score}%</div></div><div style={{ width: 150 }}><ProgressBar value={score} green={score >= 80} /></div></div><button className="btn primary" style={{ width: '100%', marginTop: 14 }} onClick={() => nav('/english')}>完成课程</button></Card>
      : <button className="btn primary" style={{ width: '100%' }} disabled={Object.keys(answers).length < lesson.questions.length} onClick={submit}>提交小测</button>}
  </div>;
}
