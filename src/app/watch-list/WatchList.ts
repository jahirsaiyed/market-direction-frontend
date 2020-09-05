export class WatchList {
  id: number;
  name: string;
  scrips: string[];

  constructor( id: number, name: string, scrips: string[]) {
    this.id = id;
    this.name = name;
    this.scrips = scrips;
  }
}
