export type ServiceResponseErrorMessages =
'UNAUTHORIZED' | 'NOT_FOUND' | 'CONFLICT' | 'BAD_REQUEST';
export type ServiceResponseSuccessMessages = 'SUCCESSFUL' |
'CREATED';

export type MessageType = {
  message: string
};

export type ServiceResponseError = {
  status: ServiceResponseErrorMessages,
  data: MessageType,
};

export type ServiceResponseSuccess<T> = {
  status: ServiceResponseSuccessMessages,
  data: T
};

export type ServiceResponse<T> = ServiceResponseError | ServiceResponseSuccess<T>;
