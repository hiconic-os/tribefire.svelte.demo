import { from, of } from "rxjs";
import { skip, switchMap } from "rxjs/operators";
import { SvelteSubject } from "../../types/SvelteSubject";
import { getCurrentUser } from "../../utils/tfjs-utils";
import { tfSessionStream } from "../sessions/tfSessionStream";

export let currentUserStream = new SvelteSubject<any | null>(null);

tfSessionStream
  .pipe(
    skip(1),
    switchMap((tfSession) => {
      return tfSession ? from(getCurrentUser(tfSession)) : of(null)
    })
  ).subscribe(
    currentUserStream
  );
