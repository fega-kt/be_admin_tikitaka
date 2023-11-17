import { IsString } from 'class-validator';

export class UploadDto {
  @IsString()
  title: string;
}
