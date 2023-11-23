import type { SvelteComponent } from 'svelte';
import { SvelteComponentDev } from 'svelte/internal';
import type { RedirectClass } from './redirect';

export interface HasSubscribe {
  subscribe: Function;
}

export type RouteGuard<T extends RouterContext> = (args: Partial<T>) => boolean;

export interface RouterContext {
  [key: string]: HasSubscribe | boolean;
}

export type GuardFunction = (routerContext: RouterContext) => boolean;

export interface Route<T extends RouterContext> {
  component: typeof SvelteComponent | typeof SvelteComponentDev | RedirectClass;
  componentParams?: any;
  guard?: RouteGuard<T>;
  whenLocked?: typeof SvelteComponent | typeof SvelteComponentDev | RedirectClass;
  preload?: boolean | number;
}

export interface RouteMap<T extends RouterContext> {
  [key: string]: Route<T>;
}
