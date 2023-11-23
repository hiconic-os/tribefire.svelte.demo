<script type="ts">
  import { afterUpdate, setContext } from 'svelte'
  import { SvelteSubject } from '../../../types/SvelteSubject'

  export let tabs: boolean = false
  export let selected: string | null = null
  let selectedStore = new SvelteSubject(selected)
  let childrenWithError = new WeakSet()

  $: if ($selectedStore !== selected) selectedStore.set(selected)

  let ref: HTMLDivElement

  setContext('ModalButtonBar', {
    clickHandler: (tab) => {
      if (tabs && tab) {
        selected = tab
      }
    },
    selectedStore,
  })

  afterUpdate(() => {
    if (tabs) {
      const children = Array.from(ref.children)

      children.forEach((child) => {
        if (typeof child.getAttribute('data-tab') !== 'string') {
          if (!childrenWithError.has(child)) {
            console.error(`ModalButtonBar child does not have tab attribute of type string`)
            childrenWithError.add(child)
          }
        }
      })

      if (!children.some((child) => child.getAttribute('data-tab') === selected)) {
        selected = children[0].getAttribute('data-tab')
      }
    }
  })
</script>

<div bind:this={ref} class="modal-button-bar">
  <slot />
</div>

<style>
  .modal-button-bar {
    display: flex;
    justify-content: stretch;
    align-items: stretch;
  }
</style>
