import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindTaskParamsDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsString()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 20 })
  @IsString()
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => (value === '' ? undefined : value))
  dueDate?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  @Transform(({ value }: { value: string }) => (value === '' ? undefined : value))
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
