import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SvelteSubject } from '../../types/SvelteSubject';
import * as tfjsUtils from '../../utils/tfjs-utils';
import { tfSessionStream } from './tfSessionStream';

export const contentAccessId = 'auth'

export let contentSessionStream = new SvelteSubject<$tf.session.PersistenceGmSession | null>(null)

export function getContentSession(): Promise<$tf.session.PersistenceGmSession> {
  return contentSessionStream.value
    ? Promise.resolve(contentSessionStream.value)
    : tfjsUtils.getSession(tfSessionStream.value as $tf.remote.TribefireRemoteSession, contentAccessId);
}

// When tfSession changes make sure tfSessionStream is changed
tfSessionStream.pipe(
  switchMap(tfSession => {
    return tfSession
      ? from(tfjsUtils.getSession(tfSession as $tf.remote.TribefireRemoteSession, contentAccessId))
      : of(null)
  }
  ),
).subscribe(
  contentSessionStream
);
