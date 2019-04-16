export class Album {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly date: string,
    public readonly primaryType: string
  ) {
  }
}
