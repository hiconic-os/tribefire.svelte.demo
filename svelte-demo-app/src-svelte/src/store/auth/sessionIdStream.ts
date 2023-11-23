import { skip } from 'rxjs/operators';
import { SvelteSubject } from '../../types/SvelteSubject';
import { isAuthenticatingStream } from "./isAuthenticatingStream";
import { isAuthenticatingViaSessionIdStream } from './isAuthenticatingViaSessionIdStream';
import { tfSessionStream } from '../sessions/tfSessionStream';
import * as tfjsUtils from '../../utils/tfjs-utils';

function signInViaSessionId(localSessionId) {
  isAuthenticatingStream.next(true)
  isAuthenticatingViaSessionIdStream.next(true)
  tfjsUtils
    .authenticateViaSessionId(localSessionId)
    .catch(error => {
      console.error(error);
      return null
    })
    .then((res: any) => {
      tfSessionStream.next(res)
      isAuthenticatingStream.next(false)
      isAuthenticatingViaSessionIdStream.next(false)
    })
}

export const sessionIdStream = new SvelteSubject<string | null>(null);

// if sessionIdStream.value !== tfSessionStream.value.sessionId
// invoke sign in via sessionId
// scenario: sessionId coming from localStorage
sessionIdStream.subscribe(sessionId => {
  if (sessionId && (sessionId !== tfSessionStream.value?.getUserSession()?.sessionId ?? null)) {
    signInViaSessionId(sessionId)
  }
})

// update sessionId stream when tfSessionStream emits a value
// skip 1 to skip initial value of null
tfSessionStream.pipe(skip(1)).subscribe(tfSession => {
  const nextSessionId = tfSession?.getUserSession()?.sessionId ?? null;
  if (nextSessionId !== sessionIdStream.value) {
    sessionIdStream.next(nextSessionId)
  }
})
