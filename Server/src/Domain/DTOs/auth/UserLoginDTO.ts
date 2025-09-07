export class UserAuthDTO {
    public constructor(
        public id:number = 0,
        public username:string = '',
        public permission:number = -1,
    ){}
}