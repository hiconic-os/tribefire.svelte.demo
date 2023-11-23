import { StreamManager } from "../types/StreamManager";
import { currentUserStream, sessionIdStream } from "../store/auth";

export default new StreamManager({
  localStorageKeyGetter: (({ user }) => user?.id ?? null),
  streams: [
    {
      name: 'sessionId',
      stream: sessionIdStream,
      bindToLocalStorage: true,
    },
    {
      name: 'user',
      stream: currentUserStream,
      bindToLocalStorage: false,
    },
  ],
});

sessionIdStream.subscribe(value => console.log('sessionIdStream', value))