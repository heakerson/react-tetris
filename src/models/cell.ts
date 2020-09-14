import { Subject } from "rxjs";
import { Shape } from "./shape";

export class Cell {
  inactiveShape?: Shape;
  clearing$?: Subject<any> = undefined;

  constructor(public row: number, public column: number) { }
}