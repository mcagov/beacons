import { DraftRegistration } from "../entities/DraftRegistration";

export interface DraftRegistrationGateway {
  deleteUse: (submissionId, useIndex) => Promise<void>;
  read: (id) => Promise<DraftRegistration>;
  update: (id, draftRegistration) => Promise<void>;
}
