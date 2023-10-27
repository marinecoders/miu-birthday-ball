<script>
  import Icon from '@iconify/svelte'
  import LightButton from '../buttons/LightButton.svelte'
  export let dropdown
  export let title
  export let href
</script>

<div>
  <div class="relative inline-block dropdown">
    <LightButton icon="mdi:chevron-down" text={title} {href} />
    <ul
      class="absolute hidden text-gray-700 rounded w-80 dropdown-menu outline dark:outline-slate-200"
    >
      {#each dropdown as item}
        <li>
          <a
            class="block dark:text-slate-500 bg-white hover:text-black dark:bg-slate-900 dark:hover:bg-slate-700 dark:hover:text-white font-bold px-4 py-2 whitespace-no-wrap hover:bg-white hover:outline hover:rounded hover:outline-red-800"
            href={item.href}>{item.text}</a
          >
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .dropdown:hover .dropdown-menu {
    display: block;
  }
</style>
