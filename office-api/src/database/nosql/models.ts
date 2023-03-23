import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class ProjectPost {
  @Prop()
  id: string;

  @Prop({ required: true })
  project_id: string;

  @Prop({ required: true })
  employee_id: string;

  @Prop({ required: true })
  office_id: string;

  @Prop()
  content: string;

  @Prop()
  media_path: string;

  @Prop()
  likes: number;

  @Prop()
  created_at: Date;
}

export type ProjectPostDocument = HydratedDocument<ProjectPost>;
export const ProjectPostSchema = SchemaFactory.createForClass(ProjectPost);
