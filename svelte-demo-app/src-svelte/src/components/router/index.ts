import Router from 'svelte-spa-router';
export { Router }

export type { HasSubscribe, Route, RouteMap, RouteGuard, RouterContext } from './types';

export { Redirect } from './redirect';

export {
  generateRoutePath,
} from './navigation';
