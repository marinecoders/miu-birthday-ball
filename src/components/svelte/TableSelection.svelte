<script>
  import TableIcon from "../../../assets/table.svg";
  import { fade } from "svelte/transition";

  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let attendeePromise;

  async function getAttendees() {
    const response = await fetch(
      "https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-bd167a67-9585-47aa-8ecf-973709cdf3c0/default/birthday-response?key=" +
        urlParams.get("key"),
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        rejectUnauthorized: false,
      }
    );

    const data = await response.json();

    const uniqueTableNumbers = [
      ...new Set(data.map((attendee) => attendee.table)),
    ];

    const byTable = uniqueTableNumbers.reduce((acc, num) => {
      acc[num] = data.filter((attendee) => attendee.table === num);
      return acc;
    }, {});

    attendeePromise = {
      attendees: data,
      byTable: byTable,
      uniqueTableNumbers: uniqueTableNumbers,
    };
  }
  getAttendees();

  $: tableNumberSelected = "";
</script>

{#if attendeePromise}
  {#if tableNumberSelected}
    <div
      transition:fade={{ duration: 2000 }}
      class="mx-12 my-10 rounded-3xl text-left"
    >
      <h3 class="text-3xl font-mono underline decoration-2 mb-2 text-slate-50">
        Table {tableNumberSelected}
      </h3>
      <ul class="text-xl text-slate-50 tracking-wide font-serif">
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
  <div class="grid grid-cols-5 gap-8 my-10 mx-4 text-xl">
    {#each attendeePromise.uniqueTableNumbers as tableNum}
      <button
        class="relative drop-shadow-md rounded-lg focus:outline-none focus:border-sky-500 focus:ring focus:ring-sky-500"
        aria-label={tableNum}
        on:click={() => (tableNumberSelected = tableNum)}
      >
        <img
          src={"../../../assets/table.svg"}
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
