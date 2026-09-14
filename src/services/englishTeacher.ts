export interface EnglishTeacherService {
  explain(knowledgePointId: string): Promise<string>;
  generatePractice(knowledgePointId: string): Promise<string[]>;
}

export class DisabledEnglishTeacherService implements EnglishTeacherService {
  async explain(): Promise<string> { throw new Error('英语 AI 老师尚未启用'); }
  async generatePractice(): Promise<string[]> { throw new Error('英语 AI 老师尚未启用'); }
}
