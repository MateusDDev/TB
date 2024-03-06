import {
  ServiceResponseErrorMessages, ServiceResponseSuccessMessages,
} from '../interfaces/ServiceResponse';

const mapStatusHTTP = (
  status: ServiceResponseErrorMessages | ServiceResponseSuccessMessages,
): number => {
  switch (status) {
    case 'SUCCESSFUL': return 200;
    case 'INVALID_DATA': return 400;
    case 'NOT_FOUND': return 404;
    case 'CONFLICT': return 409;
    default: return 500;
  }
};

export default mapStatusHTTP;
