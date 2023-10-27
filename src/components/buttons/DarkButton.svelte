<script>
  export let text = 'ID';
  export let href = 'no-name';
</script>

<button
  type="button"
  className="inline-flex items-center justify-center gap-2 px-4 py-3 mb-2 text-xs font-semibold leading-loose text-center text-white transition-all bg-red-800 border border-transparent rounded-md hover:ring-2 ring-red-800 hover:bg-red-950 hover:text-white focus:outline-none focus:ring-2 ring-offset-white focus:ring-red-300 focus:ring-offset-2 dark:bg-slate-700 dark:hover:bg-slate-950 dark:text-white"
>
  <a {href}>{text}</a>
</button>
