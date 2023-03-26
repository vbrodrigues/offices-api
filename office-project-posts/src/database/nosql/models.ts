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

@Schema()
export class ProjectLike {
  @Prop()
  id: string;

  @Prop({ required: true })
  project_post_id: string;

  @Prop({ required: true })
  liker_id: string;

  @Prop({ required: true })
  liker_name: string;

  @Prop({ required: true })
  liker_type: string;

  @Prop({ required: true })
  is_active: boolean;

  @Prop()
  created_at: Date;
}

export type ProjectLikeDocument = HydratedDocument<ProjectLike>;
export const ProjectLikeSchema = SchemaFactory.createForClass(ProjectLike);
