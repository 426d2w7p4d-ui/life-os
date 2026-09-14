export interface EnglishQuestion {
  id: string;
  type: '选择题' | '填空题' | '拼写题' | '排序题';
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface EnglishLesson {
  id: string;
  title: string;
  minutes: number;
  intro: string;
  examples: { en: string; zh: string }[];
  rule: string;
  questions: EnglishQuestion[];
}

export interface EnglishUnit {
  id: string;
  title: string;
  lessons: EnglishLesson[];
}

export interface EnglishLevel {
  id: string;
  level: number;
  title: string;
  description: string;
  units: EnglishUnit[];
}

export const curriculum: EnglishLevel[] = [
  {
    id: 'level-0', level: 0, title: '零基础英语启蒙', description: '从字母、发音和最简单的句子开始。',
    units: [
      { id: 'l0-u1', title: '字母与发音', lessons: [
        { id: 'l0-u1-1', title: '认识 26 个英文字母', minutes: 12,
          intro: '先认清字母的名字和大小写，不急着背复杂规则。',
          examples: [{ en: 'A a', zh: '字母 A 的大写和小写' }, { en: 'B b', zh: '字母 B 的大写和小写' }],
          rule: '先会认、会读、会写，再进入单词。',
          questions: [
            { id: 'q001', type: '选择题', prompt: '哪个是字母 A 的小写？', options: ['a', 'e', 'o', 'u'], answer: 'a', explanation: 'A 的小写是 a。' },
            { id: 'q002', type: '选择题', prompt: '哪个是字母 B 的大写？', options: ['D', 'P', 'B', 'R'], answer: 'B', explanation: 'b 对应的大写是 B。' }
          ] }
      ]},
      { id: 'l0-u2', title: '第一批常用词', lessons: [
        { id: 'l0-u2-1', title: 'Hello, I, you', minutes: 15,
          intro: '先学能立刻开口的词。Hello 是“你好”，I 是“我”，you 是“你/你们”。',
          examples: [{ en: 'Hello!', zh: '你好！' }, { en: 'I am Tom.', zh: '我是 Tom。' }, { en: 'You are nice.', zh: '你很好。' }],
          rule: 'I 表示“我”，you 表示“你/你们”。',
          questions: [
            { id: 'q003', type: '选择题', prompt: '“我”用哪个英文单词？', options: ['I', 'you', 'he', 'she'], answer: 'I', explanation: 'I 就是“我”。' }
          ] }
      ]}
    ]
  },
  {
    id: 'level-1', level: 1, title: '基础英语', description: '词汇、简单句、人称代词和 be 动词。',
    units: [
      { id: 'l1-u1', title: '人称代词与 be 动词', lessons: [
        { id: 'l1-u1-1', title: 'I am / You are / He is', minutes: 18,
          intro: '英语里说“我是、你是、他是”，会用不同的 be 动词。',
          examples: [{ en: 'I am a student.', zh: '我是一名学生。' }, { en: 'You are busy.', zh: '你很忙。' }, { en: 'He is my friend.', zh: '他是我的朋友。' }],
          rule: 'I 配 am；you/we/they 配 are；he/she/it 配 is。',
          questions: [
            { id: 'q101', type: '选择题', prompt: 'I ___ happy.', options: ['am', 'is', 'are'], answer: 'am', explanation: 'I 后面用 am。' },
            { id: 'q102', type: '选择题', prompt: 'She ___ a teacher.', options: ['am', 'is', 'are'], answer: 'is', explanation: 'She 后面用 is。' }
          ] }
      ]}
    ]
  },
  {
    id: 'level-2', level: 2, title: '基础语法', description: '时态、名词、冠词、形容词、副词、介词。',
    units: [
      { id: 'l2-u1', title: '一般现在时', lessons: [
        { id: 'l2-u1-1', title: '每天都发生的事', minutes: 20,
          intro: '说习惯、事实、经常发生的事情，最常用一般现在时。',
          examples: [{ en: 'I go to school every day.', zh: '我每天去上学。' }, { en: 'She likes coffee.', zh: '她喜欢咖啡。' }],
          rule: '主语是 he/she/it 时，普通动词通常要加 s 或 es。',
          questions: [
            { id: 'q201', type: '选择题', prompt: 'He ___ basketball every Sunday.', options: ['play', 'plays', 'playing'], answer: 'plays', explanation: 'He 是第三人称单数，一般现在时 play 要变 plays。' }
          ] }
      ]}
    ]
  },
  { id: 'level-3', level: 3, title: '综合听说读写', description: '把语法放进真实阅读、听力、表达和写作。', units: [] },
  { id: 'level-4', level: 4, title: '大学英语 A/B 级', description: '面向大学英语 A/B 级常见题型。', units: [] },
  { id: 'level-5', level: 5, title: '大学英语四级 CET-4', description: '四级词汇、听力、阅读、翻译与写作。', units: [] },
  { id: 'level-6', level: 6, title: '大学英语六级 CET-6', description: '六级词汇、长难句、听力、阅读、翻译与写作。', units: [] }
];

export const allLessons = curriculum.flatMap(level => level.units.flatMap(unit => unit.lessons));
