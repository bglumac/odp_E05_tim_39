import axios from "axios";
import type { NoteDto } from "../../models/notes/NoteDto";
import type { INoteAPIService } from "./INoteAPIService";

const API_URL: string = `http://localhost:8000/api/v1/notes`;

export const noteApi: INoteAPIService = {
  async getAllNotes(token: string): Promise<NoteDto[]> {
    try {
      console.log("Getting notes...")
      const res = await axios.get<{ success: boolean; message: string; data: NoteDto[] }>(
        `${API_URL}/getAll`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data || [];
    } catch (error) {
      console.error("Greška prilikom prikazivanja svih beleški:", error);
      return [];
    }
  },

  async getNoteById(token: string, noteId: number): Promise<NoteDto> {
    try {
      const res = await axios.get<{ success: boolean; message: string; data: NoteDto }>(
        `${API_URL}/getID/${noteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("res??" + res)
      return res.data.data;
    } catch (error) {
      console.error(`Greška prilikom prikazivanja beleške ${noteId}:`, error);
      throw error;
    }
  },

  async createNote(token: string, note: NoteDto): Promise<NoteDto> {
    try {
      const res = await axios.post<{ success: boolean; message: string; data: NoteDto }>(
        `${API_URL}/create`,
        note,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data.data);
      return res.data.data;
    }

    catch (error) {
      console.error("Greška pri kreiranju beleške:", error);
      console.log(error)
      throw error;
    }
  },

  async updateNote(token: string, noteId: number, note: NoteDto): Promise<NoteDto> {
    try {
      const res = await axios.post<{ success: boolean; message: string; data: NoteDto }>(
        `${API_URL}/getID/${noteId}`,
        note,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (error) {
      console.error(`Greška prilikom ažuriranja beleške ${noteId}:`, error);
      throw error;
    }
  },

  async deleteNote(token: string, noteId: number): Promise<NoteDto> {
    try {
      const res = await axios.delete<{ success: boolean; message: string; data: NoteDto }>(
        `${API_URL}/getID/${noteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (error) {
      console.error(`Greška prilikom brisanja beleške ${noteId}:`, error);
      throw error;
    }
  },

  async pinNote(token: string, noteId: number, pinned: boolean): Promise<NoteDto> {
    try {
      const res = await axios.patch<{ success: boolean; message: string; data: NoteDto }>(
        `${API_URL}/${noteId}/pin`,
        { pinned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (error) {
      console.error(`Greška prilikom pinovanja beleške ${noteId}:`, error);
      throw error;
    }
  }
}