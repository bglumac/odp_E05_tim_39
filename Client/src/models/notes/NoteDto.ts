export interface NoteDto {
    noteId: number;
    noteHeader: string;
    ownerId: number;
    content: string;
    imagePath?: string;
    isPinned: boolean;
    createdAt: string; 
    updatedAt?: string; 
    sharedWith?: number[];
}