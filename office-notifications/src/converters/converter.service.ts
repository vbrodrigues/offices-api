export abstract class MessageConverter {
  abstract convert(data: any): Promise<any>;
}
