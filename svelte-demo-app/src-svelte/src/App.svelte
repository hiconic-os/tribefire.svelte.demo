<script lang="ts">
  import Modal from './components/primitives/Modal/Modal.svelte'
  import Router from './components/router/Router.svelte'
  import { routerGuard, routes } from './main-router'
  import { interval } from 'rxjs'
  import { switchMap, takeUntil } from 'rxjs/operators'
  import { onMount$, onDestroy$ } from 'svelte-rx'
  import { commit } from './utils/data-utils'
  import { isAuthenticatingViaSessionIdStream, isSignedInStream } from './store/auth'

  $: routerContext = {
    isAuthenticatingViaSessionId: $isAuthenticatingViaSessionIdStream,
    isSignedIn: $isSignedInStream,
  }

  const autosaveInterval = 15000

  onMount$
    .pipe(
      switchMap(() => interval(autosaveInterval)),
      switchMap(() => {
        return commit()
      }),
      takeUntil(onDestroy$),
    )
    .subscribe(() => {})
</script>

<ion-app mode="ios">
  <Modal>
    <Router {routerContext} guard={routerGuard} {routes} />
  </Modal>
</ion-app>

<style type="text/scss">
  @import './styles/reset.scss';
  @import './styles/global.scss';
</style>
