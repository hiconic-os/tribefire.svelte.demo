// used for read/write multiple streams state to localStorage

import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { pick } from '../utils/helpers/lodashy';

const localStorageKeyPrefix = 'Tf.StreamManager:';
const LAST_ACTIVE_STORAGE_KEY = '_lastActiveKey';

type Stream = BehaviorSubject<any>;

interface StreamValuesMap {
  [key: string]: any;
}

interface SteamMap {
  [key: string]: Subject<any>;
}

type StreamMapToStorageKeyFn = (streamValues: StreamValuesMap) => string | null;

interface StreamManagerOptions {
  streams: {
    name: string;
    stream: Stream;
    bindToLocalStorage: boolean;
  }[],
  localStorageKeyGetter: StreamMapToStorageKeyFn;
}

// TODO: refactor this
export class StreamManager {
  private streams: SteamMap;
  private localStorageStreams: Set<string> = new Set();
  private localStorageKeyGetter: StreamMapToStorageKeyFn;
  private subscriptions: Subscription[];
  private streamingValuesStream = new BehaviorSubject<StreamValuesMap>({});
  private streamingValuesSubscription: Subscription;
  private isStreamManagerInit: boolean = false;

  /**
   * 
   * @param param0 
   */
  constructor({ streams, localStorageKeyGetter }: StreamManagerOptions) {
    this.localStorageKeyGetter = localStorageKeyGetter;

    const streamNames = new Set<string>();
    this.streams = streams.reduce((acc, { name: streamName, stream, bindToLocalStorage }) => {
      // prevent throw streams with same
      if (streamNames.has(streamName)) {
        throw Error(`stream name must be unique. here are two or more streams with name "${streamName}"`);
      }

      if (bindToLocalStorage) {
        this.localStorageStreams.add(streamName);
      }

      acc[streamName] = stream;
      return acc;
    }, {})

    this.subscriptions = Object.entries(this.streams).map(([streamName, stream]) => {
      return stream.pipe().subscribe(nextValue => this.handleStreamEmit(streamName, nextValue));
    })

    this.rehydrateStreamsFromLocalStorage();

    // save to localStorage on every stream emitValue event
    this.streamingValuesSubscription = this.streamingValuesStream.pipe(throttleTime(10)).subscribe(values => {
      const currentLocalStorageKey = this.localStorageKeyGetter(values);

      if (currentLocalStorageKey) {
        this.saveToLocalStorage(currentLocalStorageKey, pick(values, Array.from(this.localStorageStreams)));
      }
    })

    this.isStreamManagerInit = true;
  }

  destroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.streamingValuesSubscription.unsubscribe();
  }

  private readFromLocalStorage(key: string): any {
    const localStorageKey = localStorageKeyPrefix + key;
    const valueAsJSON: null | string = localStorage.getItem(localStorageKey);

    if (valueAsJSON === null) return null;

    try {
      return JSON.parse(valueAsJSON);
    } catch (error) {
      console.error(`Error parsing localStorage value.\nlocalStorage[${localStorageKey}] = "${valueAsJSON}"`);
      console.trace(error);
      return null
    }
  }

  private saveToLocalStorage(key: string, value: any): void {
    const localStorageKey = localStorageKeyPrefix + key;

    let valueAsJSON;

    try {
      valueAsJSON = JSON.stringify(value);
    } catch (error) {
      console.trace(error);
    }

    console.log('writing to localStorage', valueAsJSON)
    localStorage.setItem(localStorageKeyPrefix + LAST_ACTIVE_STORAGE_KEY, key);
    return localStorage.setItem(localStorageKey, valueAsJSON);
  }

  private rehydrateStreamsFromLocalStorage() {
    const lastActiveLocalStorageKey = localStorage.getItem(localStorageKeyPrefix + LAST_ACTIVE_STORAGE_KEY)

    if (lastActiveLocalStorageKey) {
      const localStorageValues = this.readFromLocalStorage(lastActiveLocalStorageKey);

      if (!localStorageValues || typeof localStorageValues !== 'object') {
        console.error('Invalid localStorage data for key "localStorageValues" of value =', localStorageValues);
        return
      }

      const initStreamingValues = {}
      Object.entries(this.streams).map(([streamName, stream]) => {
        initStreamingValues[streamName] = localStorageValues[streamName] ?? null

        if (localStorageValues.hasOwnProperty(streamName)) {
          stream.next(localStorageValues[streamName]);
        }
      })

      this.streamingValuesStream.next(initStreamingValues);
    }

    this.isStreamManagerInit = true
  }

  /**
   * handles a value emitted by a stream
   * and saves it to the localStorage if stream
   * was flagged as localStorage one
   */
  private handleStreamEmit(streamName: string, value: any) {
    const currentStreamingValues = this.streamingValuesStream.value;
    console.log('handleStreamEmit', { streamName, value })

    // TODO: use smarter compare that understands difference between two NaN values, etc.
    if (currentStreamingValues[streamName] !== value)
      this.streamingValuesStream.next({
        ...currentStreamingValues,
        [streamName]: value,
      });
  }
}
