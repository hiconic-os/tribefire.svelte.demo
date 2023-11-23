import { distinctUntilChanged, map } from "rxjs/operators";
import { tfSessionStream } from "../sessions/tfSessionStream";

export const isSignedInStream = tfSessionStream.pipe(
  map(session => Boolean(session)),
  distinctUntilChanged(),
);
