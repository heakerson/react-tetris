import { Subject, Observable } from "rxjs";
import { GameState } from "./store/game-state";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";
import { useState, useEffect } from "react";
import reducer from "./store/reducer";
import { Action, IAction } from "./store/actions";
import _ from "lodash";

export default class StateManager {
  private gameState$ = new Subject<GameState>();
  private currentState: GameState = new GameState();

  constructor() {
    this.gameState$.next(this.currentState);
    this.gameState$.subscribe(state => {
      this.currentState = state;
    });
  }

  public selectGameState<TStateType>(getStateFn: (state: GameState) => TStateType, areTheSame?: (x: TStateType, y: TStateType) => boolean): Observable<TStateType> {
    return this.gameState$.pipe(
      map(getStateFn),
      distinctUntilChanged(!!areTheSame ? areTheSame : _.isEqual)
    );
  }

  public getGameStateSnapshot<TStateType>(getStateFn: (state: GameState) => TStateType): TStateType {
    return getStateFn(this.currentState);
  }

  public setComponentGameStateListener<TStateType>(getStateFn: (state: GameState) => TStateType): TStateType {
    const startValueSnapshot = this.getGameStateSnapshot(getStateFn);
    const [ stateValue, setNewValue ] = useState(startValueSnapshot);
    const takeUntil$ = new Subject();

    useEffect(() => {
      let changed: boolean = false;
      const sub = this.selectGameState(getStateFn)
        .pipe(takeUntil(takeUntil$))
        .subscribe((updatedStateValue: TStateType) => {

          changed = !_.isEqual(updatedStateValue, stateValue);

          if (changed) {
            sub.unsubscribe();
            setNewValue(updatedStateValue);
          }
        });

      return changed ? () => { takeUntil$.next(); takeUntil$.complete(); } : () => {};
    }, [ stateValue ]);
    
    return startValueSnapshot;
  }

  // public updateGameState(setStateFn: (state: GameState) => GameState): void {
  //   this.gameState$.next(setStateFn(_.cloneDeep(this.currentState)));
  // }

  public dispatch(action: IAction): void {
    this.gameState$.next(reducer(this.currentState, action as Action));
  }
}