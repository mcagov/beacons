import { DraftRegistration } from "../../entities/DraftRegistration";

export interface DraftRegistrationGateway {
  deleteUse: (submissionId: string, useId: number) => Promise<void>;
  removeInvalidUse: (submissionId: string) => Promise<void>;
  makeUseMain: (submissionId: string, useId: number) => Promise<void>;
  createEmptyUse: (submissionId: string) => Promise<void>;
  read: (id: string) => Promise<DraftRegistration>;
  update: (id: string, draftRegistration: DraftRegistration) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
