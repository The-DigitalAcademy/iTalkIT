// store/follow/follow.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, catchError, of } from 'rxjs';

import * as FollowActions from './follow.actions';
import { FollowApiService } from '../../services/follow-api.service';

@Injectable()
export class FollowEffects {

  follow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FollowActions.followUser),
      mergeMap(({ userId }) =>
        this.api.follow(userId).pipe(
          catchError(() =>
            of(
              FollowActions.followFailed({
                userId,
                previousState: false
              })
            )
          )
        )
      )
    )
  );

  unfollow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FollowActions.unfollowUser),
      mergeMap(({ userId }) =>
        this.api.unfollow(userId).pipe(
          catchError(() =>
            of(
              FollowActions.followFailed({
                userId,
                previousState: true
              })
            )
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private api: FollowApiService
  ) {}
}
