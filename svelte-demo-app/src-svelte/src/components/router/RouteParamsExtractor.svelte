<script>
  import { routeParamsSubject } from './router-store'

  export let params = null

  $: routeParamsSubject.next(params)
</script>
