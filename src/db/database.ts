import Dexie, { type Table } from 'dexie';
import type {
  CalendarItem, Task, Course, Countdown, EnglishRecord, Client, Video,
  Pet, PetRecord, Expense, Memo, DailyReview, Reward, EnglishMistake, VocabularyWord
} from '../types/models';

export class LifeOSDatabase extends Dexie {
  calendars!: Table<CalendarItem, string>;
  tasks!: Table<Task, string>;
  courses!: Table<Course, string>;
  countdowns!: Table<Countdown, string>;
  englishRecords!: Table<EnglishRecord, string>;
  clients!: Table<Client, string>;
  videos!: Table<Video, string>;
  pets!: Table<Pet, string>;
  petRecords!: Table<PetRecord, string>;
  expenses!: Table<Expense, string>;
  memos!: Table<Memo, string>;
  reviews!: Table<DailyReview, string>;
  rewards!: Table<Reward, string>;
  englishMistakes!: Table<EnglishMistake, string>;
  vocabulary!: Table<VocabularyWord, string>;

  constructor() {
    super('life-os-db');
    this.version(1).stores({
      calendars: 'id, name, order, hidden, archived',
      tasks: 'id, date, calendarId, status, priority, sourceType, sourceId, updatedAt',
      courses: 'id, weekday, name, examDate, updatedAt',
      countdowns: 'id, date, category, mode',
      englishRecords: 'id, date, lessonId, createdAt',
      clients: 'id, status, name, updatedAt',
      videos: 'id, clientId, status, publishDate, contentType, updatedAt',
      pets: 'id, name, updatedAt',
      petRecords: 'id, petId, type, date, nextDate',
      expenses: 'id, date, flow, category, account',
      memos: 'id, category, linkedType, linkedId, updatedAt',
      reviews: 'id, date, updatedAt',
      rewards: 'id, redeemed, stars'
    });
    this.version(2).stores({
      englishMistakes: 'id, questionId, knowledgePoint, errorCount, mastered, updatedAt',
      vocabulary: 'id, word, familiarity, reviewDate, createdAt'
    });
  }
}

export const db = new LifeOSDatabase();
