export class NoteDTO {
    public constructor(
        public id:number = 0,
        public owner:number = 0,
        public header: string = 'None',
        public content: string = '',
        public published: boolean = false
    ){}
}