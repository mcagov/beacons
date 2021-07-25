export interface CachedRegistrationGateway {
  deleteUse: (submissionId, useIndex) => Promise<void>;
  createEmptyUse: (submissionId) => Promise<void>;
}
