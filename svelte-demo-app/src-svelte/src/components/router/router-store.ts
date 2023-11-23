export { location } from 'svelte-spa-router'
import { SvelteSubject } from '../../types/SvelteSubject'

export const currentLocationSubject = location
export const currentRoutePathSubject = new SvelteSubject<string | null>(null)
export const currentRouteParamsSubject = new SvelteSubject<{} | null>(null)