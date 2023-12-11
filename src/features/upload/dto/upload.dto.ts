import { IsString } from 'class-validator';

export class UploadDto {
  @IsString()
  title: string;
}

export type resource =
  | 'image'
  | 'video'
  | 'raw'
  | 'fetch'
  | 'private'
  | 'authenticated';
