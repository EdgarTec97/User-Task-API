import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import type { Response } from 'express';
import { DomainError } from '@/shared/domain/errors/DomainError';

@Catch()
export class HttpExceptionFilterLogger implements ExceptionFilter {
  private readonly loggerType: string;
  private readonly status: number;

  constructor(
    @Optional() private readonly logger: PinoLogger,
    private readonly config: ConfigService,
  ) {
    this.loggerType = 'EXCEPTION_FILTER';
    this.status = 500;
  }

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof DomainError) {
      const { code, message, name } = exception;

      if (this.config.get<string>('PROJECT_MODE') == 'development')
        this.logger.warn({
          type: this.loggerType,
          subType: 'UNHANDLED_DOMAIN_ERROR',
          code: code,
          fullName: name,
          message: message,
          stack: exception.stack,
          status: this.status,
        });
      response.status(this.status).json({
        code,
        message,
        name,
        statusCode: this.status,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      if (this.config.get<string>('PROJECT_MODE') == 'development')
        this.logger.info({
          type: this.loggerType,
          subType: 'HTTP_EXCEPTION',
          status,
          body,
          stack: exception.stack,
        });
      response.status(status).json(body);
      return;
    }

    if (this.config.get<string>('PROJECT_MODE') == 'development')
      this.logger.error({
        type: this.loggerType,
        subType: 'UNHANDLED_ERROR',
        fullName: exception.name,
        message: exception.message,
        stack: exception.stack,
        status: this.status,
      });

    response.status(this.status).json({
      message: exception.message,
      statusCode: this.status,
    });
  }
}
