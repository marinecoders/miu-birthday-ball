<script>
  import Icon from '@iconify/svelte'
  import LightButton from '../buttons/LightButton.svelte'
  export let dropdown
  export let title
  export let href
</script>

<div
  class="block p-4 text-sm font-semibold text-slate-600 rounded hover:bg-blue-50 hover:text-red-600"
>
  <div class="dropdown">
    <button class="flex items-cente">
      <a href={href}><span class="mr-1">{title}</span></a>
      <Icon class="text-xl" icon="mdi:chevron-down" />
    </button>
    <ul class="hidden mt-5 text-slate-700 rounded w-auto dropdown-menu">
      {#each dropdown as item}
        <li>
          <a
            class="block px-4 py-2 whitespace-no-wrap hover:text-black hover:outline rounded hover:outline-red-800"
            href="item.href">
        {item.text}</a>
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
  