export interface CachedRegistrationGateway {
  deleteUse: (submissionId, useIndex) => Promise<void>;
}
