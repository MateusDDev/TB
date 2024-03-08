import {
  ServiceResponseErrorMessages, ServiceResponseSuccessMessages,
} from '../interfaces/ServiceResponse';

const mapStatusHTTP = (
  status: ServiceResponseErrorMessages | ServiceResponseSuccessMessages,
): number => {
  switch (status) {
    case 'SUCCESSFUL': return 200;
    case 'BAD_REQUEST': return 400;
    case 'NOT_FOUND': return 404;
    case 'CONFLICT': return 409;
    case 'UNAUTHORIZED': return 401;
    case 'CREATED': return 201;
    default: return 500;
  }
};

export default mapStatusHTTP;
