export interface AIProvider {
  readonly name: string;
  readonly enabled: boolean;
  complete(prompt: string): Promise<string>;
}

export class DisabledAIProvider implements AIProvider {
  readonly name = 'disabled';
  readonly enabled = false;
  async complete(): Promise<string> {
    throw new Error('AI 功能尚未启用');
  }
}

export const aiProvider: AIProvider = new DisabledAIProvider();
