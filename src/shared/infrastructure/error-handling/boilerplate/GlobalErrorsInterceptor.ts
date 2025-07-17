import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import type { Observable } from 'rxjs';
import { DomainToInfrastructureMapper } from '@/shared/infrastructure/error-handling/DomainToInfrastructureMap';

@Injectable()
export class GlobalErrorsInterceptor implements NestInterceptor {
  constructor(private domainToInfrastructureMapper: DomainToInfrastructureMapper) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe<unknown>(
      catchError((error) => {
        for (const mapper of this.domainToInfrastructureMapper.getMappings()) {
          const [DomainErrorClass, NestHttpExceptionClass] = mapper;

          if (error instanceof DomainErrorClass) {
            throw new NestHttpExceptionClass({
              code: error.code,
              message: error.message,
            });
          }
        }

        throw error;
      }),
    );
  }
}
