export abstract class NotificationService {
  abstract notify(data): Promise<void>;
}
