export interface EventStoreSettings {
  url: string;
  stream: string;
  group: string;
  username?: string;
  password?: string;
}