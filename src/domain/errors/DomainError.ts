/** Error base del dominio: permite distinguirlo de fallas técnicas (red, disco…). */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
