export class SocketResponseDTO {
    public constructor(
        public status: "OK" | "ERROR",
        public message: string
    ){}
}