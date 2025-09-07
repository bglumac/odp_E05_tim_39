export interface NoteDto {
    id: number;
    owner: number;
    header: string;
    content?: string;        //ovde ce biti i imagePath
    published: boolean
    pinned?: boolean;
    isSelected?: boolean;
}