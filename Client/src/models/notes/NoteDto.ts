export interface NoteDto {
    id: number;
    owner: number;
    header: string;
    content?: string;        //ovde ce biti i imagePath
    public: boolean
    isPinned?: boolean;
    createdAt?: string; 
    updatedAt?: string; 
    sharedWith?: number[];
    isSelected?: boolean;
}