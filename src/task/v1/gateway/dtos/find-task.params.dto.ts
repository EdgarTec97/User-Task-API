import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindTaskParamsDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @IsString()
  page?: number;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 20 })
  @IsOptional()
  @IsString()
  pageSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string;

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
