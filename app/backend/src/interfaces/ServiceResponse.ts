export type ServiceResponseErrorMessages =
'UNAUTHORIZED' | 'NOT_FOUND' | 'CONFLICT' | 'BAD_REQUEST';
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
