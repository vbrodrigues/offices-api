export interface Notification {
  type: 'CONSOLE' | 'SMS' | 'EMAIL';
  receiver?: string | null;
  content: string;
}
