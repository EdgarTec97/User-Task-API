import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
  HttpVersionNotSupportedException,
  ImATeapotException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PayloadTooLargeException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { DomainError } from '@/shared/domain/errors/DomainError';

export type AllExceptionsClasses =
  | typeof BadRequestException
  | typeof UnauthorizedException
  | typeof NotFoundException
  | typeof ForbiddenException
  | typeof NotAcceptableException
  | typeof RequestTimeoutException
  | typeof ConflictException
  | typeof GoneException
  | typeof HttpVersionNotSupportedException
  | typeof PayloadTooLargeException
  | typeof UnsupportedMediaTypeException
  | typeof UnprocessableEntityException
  | typeof InternalServerErrorException
  | typeof NotImplementedException
  | typeof ImATeapotException
  | typeof MethodNotAllowedException
  | typeof BadGatewayException
  | typeof ServiceUnavailableException
  | typeof GatewayTimeoutException;

export type Mapper = [typeof DomainError, AllExceptionsClasses];

type DomainMapperBuilder = {
  to: (httpException: AllExceptionsClasses) => Mapper;
};

export function mapDomainError(domainError: typeof DomainError): DomainMapperBuilder {
  return {
    to: (b: AllExceptionsClasses) => {
      return [domainError, b];
    },
  };
}
