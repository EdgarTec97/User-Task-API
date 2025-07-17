import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindTaskParamsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedUser?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedUserName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedUserEmail?: string;
}
