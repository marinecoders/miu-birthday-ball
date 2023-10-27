<script>
  import Icon from '@iconify/svelte'
  export let text
  export let href
  export let icon
</script>

<a {href}>
  <button
    type="button"
    class="inline-flex items-center text-slate-600 justify-center gap-2 px-4 py-4 mb-2 text-sm font-semibold transition-all border border-transparent rounded-md hover:outline hover:outline-red-800 hover:text-black  hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300 dark:focus:ring-offset-slate-800"
  >
    <span>{text}</span>
    {#if icon}
    <Icon class="text-xl" icon="{icon}" />
    {/if}
  </button>
</a>
