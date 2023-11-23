import { replace } from "svelte-spa-router";

export class RedirectClass {
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  execute() {
    console.warn('redirecting to', this.path);
    replace(this.path);
  }
}

export function Redirect(path: string) {
  return new RedirectClass(path);
}
