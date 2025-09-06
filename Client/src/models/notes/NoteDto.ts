export interface NoteDto {
    noteId: number;
    noteTitle: string;
    content?: string;        //ovde ce biti i imagePath
    isPinned?: boolean;
    createdAt?: string; 
    updatedAt?: string; 
    sharedWith?: number[];
    isSelected?: boolean;
}