import { ShapePositionConfig } from "./shape-position-config";

export class ShapeConfig {
  public readonly A: ShapePositionConfig = new ShapePositionConfig([]);
  public readonly B: ShapePositionConfig = new ShapePositionConfig([]);
  public readonly C: ShapePositionConfig = new ShapePositionConfig([]);
  public readonly D: ShapePositionConfig = new ShapePositionConfig([]);

  constructor(miniGridA: string[][], miniGridB: string[][], miniGridC: string[][], miniGridD: string[][]) {
    this.A = new ShapePositionConfig(miniGridA);
    this.B = new ShapePositionConfig(miniGridB);
    this.C = new ShapePositionConfig(miniGridC);
    this.D = new ShapePositionConfig(miniGridD);
  }
}