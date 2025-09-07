export class Note {
  public constructor(
    public id: number = 0,
    public owner: number = 0,
    public header: string = '',
    public content: string = '',
    public pinned: boolean = false,
    public published: boolean = false
  ) {}
}