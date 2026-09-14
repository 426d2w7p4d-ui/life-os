export interface SyncProvider {
  readonly name: string;
  push(): Promise<void>;
  pull(): Promise<void>;
}

export class LocalOnlySyncProvider implements SyncProvider {
  readonly name = 'local-only';
  async push() { return; }
  async pull() { return; }
}

export const syncProvider: SyncProvider = new LocalOnlySyncProvider();
