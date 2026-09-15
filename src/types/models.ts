export type Priority = '低' | '普通' | '高' | '紧急';
export type TaskStatus = '未开始' | '进行中' | '已完成' | '逾期' | '取消';
export type VideoStatus = '选题' | '文案' | '待拍' | '已拍' | '剪辑' | '审核' | '待发布' | '已发布';

export interface CalendarItem {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  hidden: boolean;
  archived: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  calendarId: string;
  category: string;
  tags: string[];
  date: string;
  startTime?: string;
  endTime?: string;
  deadline?: string;
  priority: Priority;
  status: TaskStatus;
  progress: number;
  reminder?: string;
  repeat?: string;
  subtasks: Subtask[];
  attachments?: Attachment[];
  notes?: string;
  sourceType?: 'course' | 'video' | 'pet' | 'english' | 'manual';
  sourceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  name: string;
  teacher?: string;
  room?: string;
  color: string;
  weekday: number;
  startTime: string;
  endTime: string;
  startWeek: number;
  endWeek: number;
  weekType: '全部' | '单周' | '双周';
  notes?: string;
  examDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CountdownMemory {
  id: string;
  title: string;
  date: string;
  image?: string;
  note?: string;
}

export interface Countdown {
  id: string;
  name: string;
  date: string;
  icon: string;
  color: string;
  category: string;
  notes?: string;
  coverImage?: string;
  reminderDays?: number;
  memories?: CountdownMemory[];
  repeat: '不重复' | '每年' | '每月';
  mode: '倒计时' | '正计时' | '同时显示';
  createdAt: string;
}

export interface EnglishRecord {
  id: string;
  date: string;
  minutes: number;
  wordsLearned: number;
  lessonId?: string;
  score?: number;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  ownerName?: string;
  phone?: string;
  platform: string;
  account?: string;
  positioning?: string;
  startDate?: string;
  endDate?: string;
  promisedVideos: number;
  notes?: string;
  status: '合作中' | '暂停' | '已结束' | '归档';
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  clientId: string;
  index: number;
  title: string;
  topic?: string;
  copy?: string;
  script?: string;
  shootDate?: string;
  publishDate?: string;
  platform?: string;
  status: VideoStatus;
  contentType: string;
  materialNotes?: string;
  publishUrl?: string;
  views?: number;
  likes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  birthday?: string;
  weight?: number;
  neutered?: boolean;
  adoptionDate?: string;
  chip?: string;
  avatar?: string;
  photo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PetRecordType = '疫苗' | '狂犬' | '驱虫' | '体检' | '疾病' | '手术' | '药物' | '过敏' | '体重' | '饮食' | '洗澡' | '美容' | '用品' | '护理' | '行为' | '自定义';

export interface PetRecord {
  id: string;
  petId: string;
  type: PetRecordType;
  title: string;
  date: string;
  nextDate?: string;
  value?: number;
  unit?: string;
  hospital?: string;
  doctor?: string;
  medicine?: string;
  dosage?: string;
  attachments?: Attachment[];
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  flow: '支出' | '收入';
  category: string;
  account: string;
  date: string;
  note?: string;
  createdAt: string;
}

export interface Memo {
  id: string;
  title: string;
  content: string;
  category: string;
  checklist: { id: string; text: string; done: boolean }[];
  linkedType?: 'client' | 'course' | 'pet';
  linkedId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyReview {
  id: string;
  date: string;
  mood: number;
  bestThing?: string;
  improve?: string;
  tomorrowTop3: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  title: string;
  stars: number;
  redeemed: boolean;
  createdAt: string;
}

export interface EnglishMistake {
  id: string;
  questionId: string;
  prompt: string;
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
  knowledgePoint: string;
  errorCount: number;
  mastered: boolean;
  updatedAt: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic?: string;
  meaning: string;
  partOfSpeech?: string;
  example?: string;
  familiarity: '认识' | '模糊' | '不认识';
  reviewDate?: string;
  createdAt: string;
}
