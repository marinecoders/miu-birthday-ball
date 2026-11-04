<script>
  import { url } from "../../lib/url.js";
  import { fade } from "svelte/transition";
  import { loadAttendees } from "../../lib/attendees.js";

  let attendeePromise;

  loadAttendees().then((data) => (attendeePromise = data));

  $: tableNumberSelected = "";
</script>

{#if attendeePromise}
  {#if tableNumberSelected}
    <div
      transition:fade={{ duration: 2000 }}
      class="mx-12 my-10 rounded-3xl text-center font-serif"
    >
      <h3
        class="text-3xl underline decoration-2 underline-offset-8 mb-2 text-slate-400"
      >
        Table {tableNumberSelected}
      </h3>
      <ul class="text-xl text-slate-50 tracking-wide">
        {#each attendeePromise.byTable[tableNumberSelected] as attendee}
          <li>
            {attendee.title}
            {attendee.first_name}
            {attendee.last_name}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  <div class="grid grid-cols-5 gap-8 mt-10 mb-20 mx-4 text-xl h-dvh">
    {#each attendeePromise.uniqueTableNumbers as tableNum}
      <button
        class="relative drop-shadow-md rounded-lg focus:outline-none focus:border-sky-500 focus:ring focus:ring-sky-500"
        aria-label={tableNum}
        on:click={() => (tableNumberSelected = tableNum)}
      >
        <img
          src={url("table.svg")}
          class="m-auto"
          alt="Table Icon"
        />
        <span
          class="absolute inset-0 flex items-center justify-center text-slate-900 font-bold"
        >
          {tableNum}
        </span>
      </button>
    {/each}
  </div>
{:else}
  <p>Loading tables</p>
{/if}
