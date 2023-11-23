import { SvelteSubject } from "../../types/SvelteSubject";

// TODO: rename tfSessionStream to remoteSessionStream
export let tfSessionStream = new SvelteSubject<$tf.remote.TribefireRemoteSession | null>(null)
