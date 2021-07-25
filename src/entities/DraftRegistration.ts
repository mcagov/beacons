import { IRegistration } from "../lib/registration/types";
import { RecursivePartial } from "../utils/RecursivePartial";

export type DraftRegistration = RecursivePartial<IRegistration>;
