<script>
  import { url } from "../../lib/url.js";
  import { slide } from "svelte/transition";
  import { loadAttendees, fullName, withKey } from "../../lib/attendees.js";
  import { BUTTON_SECONDARY } from "../../lib/ui.js";

  let attendeePromise;
  let failed = false;
  let tableNumberSelected = "";
  let panel;

  loadAttendees()
    .then((data) => (attendeePromise = data))
    .catch(() => (failed = true));

  async function choose(tableNum) {
    tableNumberSelected = tableNumberSelected === tableNum ? "" : tableNum;
    if (tableNumberSelected) {
      await Promise.resolve();
      panel?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
</script>

{#if attendeePromise}
  {#if tableNumberSelected}
    <div
      bind:this={panel}
      transition:slide={{ duration: 250 }}
      class="mx-auto mt-6 max-w-lg rounded-3xl border border-gold/20 bg-ink-800/80 p-6 text-center shadow-glow"
    >
      <h3 class="font-serif text-3xl font-semibold text-gold">
        Table {tableNumberSelected}
      </h3>
      <ul class="mt-4 space-y-1.5 font-serif text-xl text-slate-100">
        {#each attendeePromise.byTable[tableNumberSelected] as attendee}
          <li>{fullName(attendee)}</li>
        {/each}
      </ul>
      <a
        class={BUTTON_SECONDARY + " mt-6"}
        href={withKey(url("table_map/?") + new URLSearchParams({ table: tableNumberSelected }))}
      >
        Show on the map
      </a>
    </div>
  {/if}
  <div
    class="mx-auto mt-8 grid max-w-3xl grid-cols-4 gap-3 sm:grid-cols-6 sm:gap-4 md:grid-cols-8 lg:grid-cols-10"
  >
    {#each attendeePromise.uniqueTableNumbers as tableNum}
      <button
        type="button"
        class="group relative aspect-square rounded-2xl transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
        class:selected={tableNumberSelected === tableNum}
        aria-label={`Table ${tableNum}`}
        aria-pressed={tableNumberSelected === tableNum}
        on:click={() => choose(tableNum)}
      >
        <img
          src={url("table.svg")}
          class="h-full w-full object-contain opacity-90 transition group-hover:opacity-100"
          alt=""
        />
        <span
          class="absolute inset-0 flex items-center justify-center text-base font-bold text-ink sm:text-lg"
        >
          {tableNum}
        </span>
      </button>
    {/each}
  </div>
{:else if failed}
  <p class="mt-6 text-center text-slate-400">The guest list couldn't be loaded.</p>
{:else}
  <div class="mx-auto mt-8 grid max-w-3xl grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10" aria-label="Loading tables">
    {#each Array(20) as _}
      <div class="aspect-square animate-pulse rounded-full bg-white/5"></div>
    {/each}
  </div>
{/if}

<style>
  .selected {
    transform: scale(1.08);
  }
  .selected img {
    filter: sepia(1) saturate(4) hue-rotate(5deg) brightness(1.05);
    opacity: 1;
  }
</style>
