export interface ProjectPost {
  id: string;
  project_id: string;
  employee_id: string;
  office_id: string;
  content: string;
  media_path: string;
  likes: number;
  created_at: Date;
}

export interface CreateProjectPostDTO {
  project_id: string;
  employee_id: string;
  office_id: string;
  client_id: string;
  content: string;
  encoded_media: string;
  encoded_media_format: string;
}

export interface LikeProjectPostDTO {
  project_post_id: string;
  liker_id: string;
  liker_name: string;
  liker_type: string;
}

export interface UnlikeProjectPostDTO {
  project_post_id: string;
  liker_id: string;
}
