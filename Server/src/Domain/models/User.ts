export class User {
  public constructor(
    public id: number = 0,
    public username: string = '',
    public password: string = '',
    public permission: number = -1
  ) {}
}