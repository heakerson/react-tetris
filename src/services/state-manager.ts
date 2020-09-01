import { Subject, Observable } from "rxjs";
import { GameState } from "../models/game-state";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";
import { useState, useEffect } from "react";
import _ from "lodash";

export default class StateManager {
  private gameState$ = new Subject<GameState>();
  private currentState: GameState = {} as GameState;

  constructor() {
    this.gameState$.subscribe(state => {
      this.currentState = state;
    });
    this.resetGame();
  }

  public resetGame(): void {
    this.gameState$.next(new GameState());
  }

  public selectGameState<TStateType>(getStateFn: (state: GameState) => TStateType, areTheSame?: (x: TStateType, y: TStateType) => boolean): Observable<TStateType> {
    return this.gameState$.pipe(
      map(getStateFn),
      distinctUntilChanged(areTheSame)
    );
  }

  public getCurrentGameState<TStateType>(getStateFn: (state: GameState) => TStateType): TStateType {
    return getStateFn(this.currentState);
  }

  public setGameStateListener<TStateType>(getStateFn: (state: GameState) => TStateType): TStateType {
    const currentValue = this.getCurrentGameState(getStateFn);
    const [ stateValue, setNewValue ] = useState(currentValue);
    const takeUntil$ = new Subject();

    useEffect(() => {
      const sub = this.selectGameState(getStateFn)
        .pipe(takeUntil(takeUntil$))
        .subscribe((count: TStateType) => {
          if (count !== stateValue) {
            sub.unsubscribe();
            setNewValue(count);
          }
        });

      return () => { takeUntil$.next(); takeUntil$.complete(); }
    });
    
    return currentValue;
  }

  public updateGameState(setStateFn: (state: GameState) => GameState): void {
    this.gameState$.next(setStateFn(_.cloneDeep(this.currentState)));
  }
}