import { db } from './database';
import { uid } from '../utils/id';
import { todayISO, toLocalISO } from '../utils/date';

const stamp = () => new Date().toISOString();

export async function ensureSeedData() {
  const existing = await db.calendars.count();
  if (existing > 0) return;

  const today = todayISO();
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const exam = new Date(); exam.setDate(exam.getDate() + 46);
  const now = stamp();

  const studyCal = { id: uid(), name: '学习', color: '#6f86ff', icon: 'BookOpen', order: 1, hidden: false, archived: false, createdAt: now };
  const workCal = { id: uid(), name: '工作', color: '#8b75d7', icon: 'Briefcase', order: 2, hidden: false, archived: false, createdAt: now };
  const lifeCal = { id: uid(), name: '生活', color: '#5e9d7f', icon: 'Home', order: 3, hidden: false, archived: false, createdAt: now };
  const petCal = { id: uid(), name: '宠物', color: '#d58a54', icon: 'PawPrint', order: 4, hidden: false, archived: false, createdAt: now };
  const videoCal = { id: uid(), name: '短视频', color: '#6477a8', icon: 'Video', order: 5, hidden: false, archived: false, createdAt: now };
  await db.calendars.bulkAdd([studyCal, workCal, lifeCal, petCal, videoCal]);

  await db.tasks.bulkAdd([
    { id: uid(), title: '完成英语第一单元', description: '完成讲解、练习与小测', calendarId: studyCal.id, category: '英语', tags: ['学习'], date: today, startTime: '09:00', priority: '高', status: '进行中', progress: 60, subtasks: [
      { id: uid(), title: '背单词', done: true }, { id: uid(), title: '学习语法', done: true }, { id: uid(), title: '完成练习', done: true }, { id: uid(), title: '错题复习', done: false }, { id: uid(), title: '单元测试', done: false }
    ], sourceType: 'english', createdAt: now, updatedAt: now },
    { id: uid(), title: '剪辑客户 A 第 8 条视频', calendarId: videoCal.id, category: '客户工作', tags: ['视频'], date: today, startTime: '15:30', priority: '高', status: '未开始', progress: 0, subtasks: [], sourceType: 'video', createdAt: now, updatedAt: now },
    { id: uid(), title: '整理本周课程笔记', calendarId: studyCal.id, category: '课程', tags: [], date: today, startTime: '20:00', priority: '普通', status: '未开始', progress: 0, subtasks: [], sourceType: 'course', createdAt: now, updatedAt: now },
    { id: uid(), title: '给团子做驱虫', calendarId: petCal.id, category: '宠物', tags: ['健康'], date: today, startTime: '21:00', priority: '普通', status: '未开始', progress: 0, subtasks: [], sourceType: 'pet', createdAt: now, updatedAt: now }
  ]);

  const weekday = new Date().getDay() || 7;
  const courseRows = [
    { name: '大学英语', teacher: '王老师', room: 'A302', color: '#6f82ef', weekday, startTime: '14:00', endTime: '15:30' },
    { name: '摄影基础', teacher: '李老师', room: '影棚2', color: '#ce7898', weekday: weekday === 7 ? 1 : weekday + 1, startTime: '10:00', endTime: '11:30' },
    { name: '传播学', teacher: '周老师', room: 'B301', color: '#4b9a77', weekday: weekday >= 6 ? 2 : weekday + 2, startTime: '14:00', endTime: '15:30' },
    { name: '新媒体运营', teacher: '陈老师', room: 'C208', color: '#8c71d6', weekday: weekday >= 5 ? 3 : weekday + 3, startTime: '09:00', endTime: '10:30' }
  ];
  await db.courses.bulkAdd(courseRows.map(c => ({ id: uid(), ...c, startWeek: 1, endWeek: 18, weekType: '全部' as const, examDate: c.name === '大学英语' ? toLocalISO(exam) : undefined, createdAt: now, updatedAt: now })));

  const birthday = new Date(); birthday.setDate(birthday.getDate() + 12);
  const salary = new Date(); salary.setDate(salary.getDate() + 8);
  await db.countdowns.bulkAdd([
    { id: uid(), name: '妈妈生日', date: toLocalISO(birthday), icon: '🎂', color: '#ce7898', category: '生日', repeat: '每年', mode: '倒计时', reminderDays: 7, memories: [], createdAt: now },
    { id: uid(), name: '英语四级考试', date: toLocalISO(exam), icon: 'A+', color: '#6f82ef', category: '考试', repeat: '不重复', mode: '倒计时', reminderDays: 30, memories: [], createdAt: now },
    { id: uid(), name: '工资日', date: toLocalISO(salary), icon: '¥', color: '#d18653', category: '工资日', repeat: '每月', mode: '倒计时', reminderDays: 1, memories: [], createdAt: now },
    { id: uid(), name: '团子生日', date: '2023-04-12', icon: '🐾', color: '#4b9a77', category: '宠物', repeat: '每年', mode: '正计时', reminderDays: 7, memories: [], createdAt: now }
  ]);

  await db.englishRecords.bulkAdd([{ id: uid(), date: today, minutes: 22, wordsLearned: 20, lessonId: 'l0-u1-1', score: 90, createdAt: now }]);

  const clientId = uid();
  await db.clients.add({ id: clientId, name: '客户 A', ownerName: '张总', platform: '抖音', account: '品牌官方号', positioning: '本地生活', promisedVideos: 20, status: '合作中', startDate: today, notes: '本月目标 20 条', createdAt: now, updatedAt: now });
  await db.videos.bulkAdd(Array.from({ length: 8 }, (_, i) => ({ id: uid(), clientId, index: i + 1, title: `本月视频 ${i + 1}`, topic: '内容选题', platform: '抖音', status: i < 7 ? '已发布' as const : '剪辑' as const, contentType: i % 2 === 0 ? '科普' : '案例', views: i < 7 ? 1000 + i * 230 : undefined, likes: i < 7 ? 40 + i * 7 : undefined, createdAt: now, updatedAt: now })));

  const petId = uid();
  await db.pets.add({ id: petId, name: '团子', species: '猫', breed: '英短', sex: '女生', weight: 4.6, neutered: true, birthday: '2023-04-12', adoptionDate: '2024-01-26', avatar: '🐈', notes: '性格安静，换粮需要慢慢过渡。', createdAt: now, updatedAt: now });
  const r1 = new Date(); r1.setDate(r1.getDate() - 35);
  const r2 = new Date(); r2.setDate(r2.getDate() - 70);
  const nextVaccine = new Date(); nextVaccine.setDate(nextVaccine.getDate() + 28);
  await db.petRecords.bulkAdd([
    { id: uid(), petId, type: '驱虫', title: '体内外驱虫', date: today, nextDate: toLocalISO(tomorrow), medicine: '大宠爱', dosage: '0.75ml', createdAt: now },
    { id: uid(), petId, type: '疫苗', title: '猫三联加强针', date: toLocalISO(r1), nextDate: toLocalISO(nextVaccine), medicine: '妙三多', hospital: '宠爱动物医院', createdAt: now },
    { id: uid(), petId, type: '体检', title: '年度体检', date: toLocalISO(r2), hospital: '宠爱动物医院', notes: '血常规正常', createdAt: now },
    { id: uid(), petId, type: '体重', title: '体重记录', date: toLocalISO(r2), value: 4.4, unit: 'kg', createdAt: now },
    { id: uid(), petId, type: '体重', title: '体重记录', date: toLocalISO(r1), value: 4.5, unit: 'kg', createdAt: now },
    { id: uid(), petId, type: '体重', title: '体重记录', date: today, value: 4.6, unit: 'kg', createdAt: now }
  ]);

  await db.expenses.bulkAdd([
    { id: uid(), amount: 18.6, flow: '支出', category: '餐饮', account: '微信', date: today, note: '午餐', createdAt: now },
    { id: uid(), amount: 20, flow: '支出', category: '交通', account: '支付宝', date: today, note: '打车', createdAt: now }
  ]);

  await db.memos.add({ id: uid(), title: '下周短视频选题', content: '整理三个科普方向和两个案例方向。', category: '短视频', checklist: [], linkedType: 'client', linkedId: clientId, createdAt: now, updatedAt: now });
  await db.rewards.bulkAdd([
    { id: uid(), title: '奶茶', stars: 500, redeemed: false, createdAt: now },
    { id: uid(), title: '买喜欢的东西', stars: 1000, redeemed: false, createdAt: now }
  ]);
}
