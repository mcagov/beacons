import axios from "axios";
import { NotesGateway } from "./NotesGateway"; // Adjust path as needed
import { applicationConfig } from "config";
import { IAuthGateway } from "../auth/IAuthGateway";
import { INote, NoteType } from "../../entities/INote";
import { INotesGateway } from "./INotesGateway";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("NotesGateway", () => {
  let notesGateway: INotesGateway;
  let mockAuthGateway: IAuthGateway;
  let accessToken: string;
  let config: any;
  let beaconId: string;

  beforeEach(() => {
    jest.clearAllMocks();
    accessToken = "LET.ME.IN";
    mockAuthGateway = {
      getAccessToken: jest.fn().mockResolvedValue(accessToken),
    };

    config = {
      timeout: applicationConfig.apiTimeoutMs,
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    notesGateway = new NotesGateway(mockAuthGateway);
    beaconId = "f48e8212-2e10-4154-95c7-bdfd061bcfd2";
  });

  describe("getNotes", () => {
    it("should make a GET request to the correct endpoint with auth headers", async () => {
      const apiResponse = {
        data: {
          data: [],
        },
      };
      mockedAxios.get.mockResolvedValue(apiResponse);

      await notesGateway.getNotes(beaconId);

      expect(mockAuthGateway.getAccessToken).toHaveBeenCalled();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${applicationConfig.apiUrl}/note?beaconId=${beaconId}`,
        config,
      );
    });

    it("should correctly map the API response to INote objects", async () => {
      const mockApiDate = "2023-01-01T12:00:00Z";
      const apiResponse = {
        data: {
          data: [
            {
              id: "note-1",
              attributes: {
                beaconId: beaconId,
                text: "Test Note Content",
                type: "GENERAL",
                createdDate: mockApiDate,
                userId: "user-1",
                fullName: "User Note",
                email: "user@example.com",
              },
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(apiResponse);

      const result = await notesGateway.getNotes(beaconId);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: "note-1",
        beaconId: beaconId,
        text: "Test Note Content",
        type: NoteType.GENERAL,
        createdDate: mockApiDate,
        userId: "user-1",
        fullName: "User Note",
        email: "user@example.com",
      });
    });

    it("should return an empty array if the API returns no data", async () => {
      mockedAxios.get.mockResolvedValue({ data: { data: [] } });

      const result = await notesGateway.getNotes(beaconId);

      expect(result).toEqual([]);
    });

    it("should re-throw errors if the API call fails", async () => {
      const error = new Error("Network Error");
      mockedAxios.get.mockRejectedValue(error);

      await expect(notesGateway.getNotes(beaconId)).rejects.toThrow(
        "Network Error",
      );
    });
  });

  describe("createNote", () => {
    const newNotePartial: Partial<INote> = {
      beaconId: beaconId,
      text: "New Note",
      type: NoteType.INCIDENT,
    };

    it("should make a POST request with the correct body structure and headers", async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            id: "new-id",
            attributes: { ...newNotePartial },
          },
        },
      });

      await notesGateway.createNote(newNotePartial);

      expect(mockAuthGateway.getAccessToken).toHaveBeenCalled();

      const expectedPayload = {
        data: {
          type: "note",
          attributes: {
            beaconId: "",
            text: newNotePartial.text,
            type: newNotePartial.type,
          },
        },
      };

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${applicationConfig.apiUrl}/note`,
        expectedPayload,
        config,
      );
    });

    it("should map the creation response back to an INote", async () => {
      const apiResponse = {
        data: {
          data: {
            id: "note-id",
            attributes: {
              beaconId: beaconId,
              text: "New Note",
              type: "INCIDENT",
              createdDate: "2023-01-01",
              userId: "user-test",
              fullName: "Test User",
              email: "user@example.com",
            },
          },
        },
      };
      mockedAxios.post.mockResolvedValue(apiResponse);

      const result = await notesGateway.createNote(newNotePartial);

      expect(result.id).toBe("note-id");
      expect(result.fullName).toBe("Test User");
    });

    it("should handle default values for missing attributes in the request payload", async () => {
      const emptyNote: Partial<INote> = {};
      mockedAxios.post.mockResolvedValue({
        data: { data: { attributes: {} } },
      });

      try {
        await notesGateway.createNote(emptyNote);
      } catch (e) {
        // Ignore response mapping errors for this specific assertion
      }

      const expectedPayload = {
        data: {
          type: "note",
          attributes: {
            beaconId: "",
            text: "",
            type: "",
          },
        },
      };

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expectedPayload,
        expect.any(Object),
      );
    });

    it("should re-throw errors if the POST request fails", async () => {
      mockedAxios.post.mockRejectedValue(new Error("500 Server Error"));

      await expect(notesGateway.createNote(newNotePartial)).rejects.toThrow(
        "500 Server Error",
      );
    });
  });

  describe("updateNote", () => {
    const noteId = "note-123";
    const updateData: Partial<INote> = {
      text: "Updated text content",
      type: NoteType.GENERAL,
    };

    it("should make a PATCH request to the note endpoint with the specific ID", async () => {
      mockedAxios.patch.mockResolvedValue({
        data: {
          data: {
            id: noteId,
            attributes: { ...updateData, beaconId },
          },
        },
      });

      await notesGateway.updateNote(noteId, updateData);

      expect(mockAuthGateway.getAccessToken).toHaveBeenCalled();

      const expectedUrl = `${applicationConfig.apiUrl}/note/${noteId}`;

      const expectedPayload = {
        data: {
          type: "note",
          attributes: {
            beaconId: "",
            text: "Updated text content",
            type: "GENERAL",
          },
        },
      };

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expectedUrl,
        expectedPayload,
        config,
      );
    });

    it("should return the updated note object", async () => {
      mockedAxios.patch.mockResolvedValue({
        data: {
          data: {
            id: noteId,
            attributes: {
              beaconId: beaconId,
              text: "Updated text content",
              type: "GENERAL",
              createdDate: "2023-01-01",
              userId: "user-1",
              fullName: "Test User",
              email: "user@example.com",
            },
          },
        },
      });

      const result = await notesGateway.updateNote(noteId, updateData);

      expect(result.id).toEqual(noteId);
      expect(result.text).toEqual("Updated text content");
    });
  });

  describe("deleteNote", () => {
    const noteId = "note-to-delete";

    it("should make a DELETE request to the specific note endpoint", async () => {
      mockedAxios.delete.mockResolvedValue({ status: 204 });

      await notesGateway.deleteNote(noteId);

      const expectedUrl = `${applicationConfig.apiUrl}/note/${noteId}`;

      expect(mockedAxios.delete).toHaveBeenCalledWith(expectedUrl, config);
    });

    it("should throw an error if the delete fails", async () => {
      mockedAxios.delete.mockRejectedValue(new Error("403 Forbidden"));
      await expect(notesGateway.deleteNote(noteId)).rejects.toThrow(
        "403 Forbidden",
      );
    });
  });
});
