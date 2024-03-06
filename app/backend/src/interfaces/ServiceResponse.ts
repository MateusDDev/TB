export type ServiceResponseErrorMessages = 'INVALID_DATA' |
'UNAUTHORIZED' | 'NOT_FOUND' | 'CONFLICT';
export type ServiceResponseSuccessMessages = 'SUCCESSFUL' |
'CREATED';

export type ServiceResponseError = {
  status: ServiceResponseErrorMessages,
  data: { message: string }
};

export type ServiceResponseSuccess<T> = {
  status: ServiceResponseSuccessMessages,
  data: T
};

export type ServiceResponse<T> = ServiceResponseError | ServiceResponseSuccess<T>;
