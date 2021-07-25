import { DraftRegistration } from "../entities/DraftRegistration";

export interface DraftRegistrationGateway {
  deleteUse: (submissionId: string, useIndex: number) => Promise<void>;
  createEmptyUse: (submissionId: string) => Promise<void>;
  read: (id) => Promise<DraftRegistration>;
  update: (id, draftRegistration) => Promise<void>;
}
