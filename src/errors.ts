
export enum DLMErrorTypes {
  INVALID_PARAMTERS = 'invalid_parameters',
  NOT_INITIALIZED = 'not_initialized',
  INITIALIZATION_FAILED = 'initialization_failed'
}

export const InvalidKeyError = {
  err_type: DLMErrorTypes.INVALID_PARAMTERS,
  err_message: 'Invalid Key'
};

export const NotInitializedError = {
  err_type: DLMErrorTypes.NOT_INITIALIZED,
  err_message: 'configuration not set'
};

export const MysqlUriMissingError = {
  err_type: DLMErrorTypes.INVALID_PARAMTERS,
  err_message: 'Mysql URI Missing'
};

export class DLMError extends Error {
  err_message: string;
  err_type: DLMErrorTypes;
  constructor(error: { err_message: string; err_type: DLMErrorTypes }) {
    super(error.err_message);
    this.err_message = error.err_message;
    this.err_type = error.err_type;
  }
}
