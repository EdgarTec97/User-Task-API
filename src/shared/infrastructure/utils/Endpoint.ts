import { applyDecorators, HttpCode } from '@nestjs/common';
import { ApiResponse as NestApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseOptions } from '@nestjs/swagger';

export enum DocumentationTags {
  META = 'Meta',
  USERS = '[App] Users',
  TASKS = '[App] Tasks',
  ADMIN = '[App] Admin',
}

export type Options = {
  tags: DocumentationTags[];
};

export function Endpoint(options: ApiResponseOptions & Options) {
  if (options.status && typeof options.status === 'number') {
    return applyDecorators(NestApiResponse(options), HttpCode(options.status), ApiTags(...options.tags));
  }

  return applyDecorators(NestApiResponse(options), ApiTags(...options.tags));
}
