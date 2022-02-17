import axios, { AxiosResponse } from "axios";
import { applicationConfig } from "../../config";
import { INote, NoteType } from "../../entities/INote";
import { IAuthGateway } from "../auth/IAuthGateway";
import { INoteRequest } from "../mappers/INoteRequest";
import { INoteResponse } from "../mappers/INoteResponse";
import { INoteResponseData } from "../mappers/INoteResponseData";
import { INotesResponse } from "../mappers/INotesResponse";
import { INotesGateway } from "./INotesGateway";

export class NotesGateway implements INotesGateway {
  private _authGateway: IAuthGateway;

  public constructor(authGateway: IAuthGateway) {
    this._authGateway = authGateway;
  }

  public async getNotes(beaconId: string): Promise<INote[]> {
    try {
      const response = await this._makeGetRequest(`/note?beaconId=${beaconId}`);
      return this._mapNotesListResponseToNotes(response.data);
    } catch (e) {
      throw Error(e);
    }
  }

  public async createNote(note: Partial<INote>): Promise<INote> {
    try {
      const response = await this._makePostRequest(`/note`, note);
      return this._mapNoteResponseToNote(response.data);
    } catch (e) {
      throw Error(e);
    }
  }

  private async _makeGetRequest(path: string): Promise<AxiosResponse> {
    const accessToken = await this._authGateway.getAccessToken();

    return await axios.get(`${applicationConfig.apiUrl}${path}`, {
      timeout: applicationConfig.apiTimeoutMs,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  private async _makePostRequest(
    path: string,
    note: Partial<INote>
  ): Promise<AxiosResponse> {
    const accessToken = await this._authGateway.getAccessToken();

    return await axios.post(
      `${applicationConfig.apiUrl}${path}`,
      this._mapNoteToNoteRequest(note),
      {
        timeout: applicationConfig.apiTimeoutMs,
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  }

  private _mapNoteToNoteRequest(note: Partial<INote>): INoteRequest {
    return {
      data: {
        type: "note",
        attributes: {
          beaconId: note.beaconId || "",
          text: note.text || "",
          type: note.type || "",
        },
      },
    };
  }

  private _mapNoteResponseToNote(noteResponse: INoteResponse): INote {
    return this._mapData(noteResponse.data);
  }

  private _mapNotesListResponseToNotes(notesResponse: INotesResponse): INote[] {
    if (!notesResponse.data || notesResponse.data.length === 0) return [];

    return notesResponse.data.map((noteResponseData) =>
      this._mapData(noteResponseData)
    );
  }

  private _mapData(responseData: INoteResponseData) {
    return {
      id: responseData.id,
      beaconId: responseData.attributes.beaconId,
      text: responseData.attributes.text,
      type: NoteType[responseData.attributes.type as NoteType],
      createdDate: responseData.attributes.createdDate,
      userId: responseData.attributes.userId,
      fullName: responseData.attributes.fullName,
      email: responseData.attributes.email,
    };
  }
}
