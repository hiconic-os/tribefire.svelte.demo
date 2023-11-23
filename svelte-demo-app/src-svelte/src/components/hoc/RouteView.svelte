<script lang="ts">
  import { isMainMenuRoute$ } from '../../store/layout-stores'

  export let itemCount: number = 1
  export let showMenu: boolean = false

  if (showMenu !== isMainMenuRoute$.value) {
    document.documentElement.style.setProperty('--safeAreaInsetLeft', 'var(--mainMenuWidth)')
    document.documentElement.style.setProperty('--safeAreaInsetRight', 'var(--mainLangMenuWidth)')
    isMainMenuRoute$.next(showMenu)
  }
</script>

<main class:two-papers={itemCount > 1}>
  <slot name="paper" />
  <slot />
</main>

<style type="text/scss">
  @import '../../styles/mixins.scss';
  @import '../../styles/variables.scss';

  main {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    position: relative;
    min-height: 100%;
    max-height: 100%;
  }
</style>
