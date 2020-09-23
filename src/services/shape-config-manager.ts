import { RotationDirection } from "../models/rotation-direction";
import { RotationPoint } from "../models/rotation-point";
import { ShapeConfig } from "../models/shape-config";
import { ShapePositionConfig } from "../models/shape-position-config";
import { ShapeType } from "../models/shape-type";

export class ShapeConfigManager {
  private Bar: ShapeConfig = new ShapeConfig(
    [
      ['_', '_', '_', '_'],
      ['0', '1', '2', '3'],
      ['_', '_', '_', '_'],
      ['_', '_', '_', '_'],
    ],
    [
      ['_', '_', '3', '_'],
      ['_', '_', '2', '_'],
      ['_', '_', '1', '_'],
      ['_', '_', '0', '_'],
    ],
    [
      ['_', '_', '_', '_'],
      ['_', '_', '_', '_'],
      ['0', '1', '2', '3'],
      ['_', '_', '_', '_'],
    ],
    [
      ['_', '3', '_', '_'],
      ['_', '2', '_', '_'],
      ['_', '1', '_', '_'],
      ['_', '0', '_', '_'],
    ]);


  private L: ShapeConfig = new ShapeConfig(
    [
      ['_', '_', '3'],
      ['0', '1', '2'],
      ['_', '_', '_'],
    ],
    [
      ['_', '2', '_'],
      ['_', '1', '_'],
      ['_', '0', '3'],
    ],
    [
      ['_', '_', '_'],
      ['1', '2', '3'],
      ['0', '_', '_']
    ],
    [
      ['0', '1', '_'],
      ['_', '2', '_'],
      ['_', '3', '_'],
    ]);


  private ReverseL: ShapeConfig = new ShapeConfig(
    [
      ['3', '_', '_'],
      ['0', '1', '2'],
      ['_', '_', '_'],
    ],
    [
      ['_', '2', '3'],
      ['_', '1', '_'],
      ['_', '0', '_'],
    ],
    [
      ['_', '_', '_'],
      ['1', '2', '3'],
      ['_', '_', '0']
    ],
    [
      ['_', '3', '_'],
      ['_', '2', '_'],
      ['0', '1', '_'],
    ]);


  private Box: ShapeConfig = new ShapeConfig(
    [
      ['0', '1'],
      ['2', '3'],
    ],
    [
      ['0', '1'],
      ['2', '3'],
    ],
    [
      ['0', '1'],
      ['2', '3'],
    ],
    [
      ['0', '1'],
      ['2', '3'],
    ]);


  private S: ShapeConfig = new ShapeConfig(
    [
      ['_', '0', '1'],
      ['2', '3', '_'],
      ['_', '_', '_'],
    ],
    [
      ['_', '1', '_'],
      ['_', '0', '3'],
      ['_', '_', '2'],
    ],
    [
      ['_', '_', '_'],
      ['_', '0', '1'],
      ['2', '3', '_'],
    ],
    [
      ['1', '_', '_'],
      ['0', '3', '_'],
      ['_', '2', '_'],
    ]);

  
  private Z: ShapeConfig = new ShapeConfig(
    [
      ['0', '1', '_'],
      ['_', '2', '3'],
      ['_', '_', '_'],
    ],
    [
      ['_', '_', '3'],
      ['_', '1', '2'],
      ['_', '0', '_'],
    ],
    [
      ['_', '_', '_'],
      ['0', '1', '_'],
      ['_', '2', '3'],
    ],
    [
      ['_', '3', '_'],
      ['1', '2', '_'],
      ['0', '_', '_'],
    ]);


  private T: ShapeConfig = new ShapeConfig(
    [
      ['_', '3', '_'],
      ['0', '1', '2'],
      ['_', '_', '_'],
    ],
    [
      ['_', '2', '_'],
      ['_', '1', '3'],
      ['_', '0', '_'],
    ],
    [
      ['_', '_', '_'],
      ['1', '2', '3'],
      ['_', '0', '_']
    ],
    [
      ['_', '3', '_'],
      ['0', '2', '_'],
      ['_', '1', '_'],
    ]);


  public getConfigFor(shapeType: ShapeType, rotationPosition: RotationPoint): ShapePositionConfig {
    return this[shapeType][rotationPosition];
  }

  public getNextRotationPoint(currentRotationPoint: RotationPoint, rotationDirection: RotationDirection): RotationPoint {
    if (rotationDirection === RotationDirection.Clockwise) {
      switch(currentRotationPoint) {
        case RotationPoint.A:
          return RotationPoint.B;
        case RotationPoint.B:
          return RotationPoint.C;
        case RotationPoint.C:
          return RotationPoint.D;
        case RotationPoint.D:
          return RotationPoint.A;
      }
    } else {
      switch(currentRotationPoint) {
        case RotationPoint.A:
          return RotationPoint.D;
        case RotationPoint.B:
          return RotationPoint.A;
        case RotationPoint.C:
          return RotationPoint.B;
        case RotationPoint.D:
          return RotationPoint.C;
      }
    }
  }
}