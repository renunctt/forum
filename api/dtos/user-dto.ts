export class UserDto {
  id: number
  email: string
  name: string

  constructor(model) {
    this.id = model.id
    this.name = model.name
    this.email = model.email
  }
}
