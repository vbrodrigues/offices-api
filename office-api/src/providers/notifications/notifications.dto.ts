export interface Notification {
  // CONSOLE only logs it (useful in development); EMAIL needs `receiver`
  type: 'CONSOLE' | 'EMAIL';
  receiver?: string | null;
  content: string;
}
