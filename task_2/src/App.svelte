<script lang="ts">
  let data: {
    conversion_rates: {};
  };
  let pair: {
    conversion_rate: number;
  };
  let inputValueLeft: number;
  let inputValueRight: number;
  let currentCurrencyLeft = 'USD';
  let currentCurrencyRight = 'USD';

  $: selectRight;
  $: selectLeft;
  $: changeValueRight;
  $: changeValueLeft;

  async function selectRight(event: Event) {
    const selectLefttId = document.querySelector('#select-left') as HTMLInputElement;
    const target = event.target as HTMLInputElement;
    await fetchConverter(selectLefttId?.value, target.value);
    if (target.value !== selectLefttId.value) {
      inputValueRight = pair.conversion_rate * inputValueLeft;
    } else {
      inputValueRight = inputValueLeft;
    }
  }

  async function selectLeft(event: Event) {
    const selectRightId = document.querySelector('#select-right') as HTMLInputElement;
    const target = event.target as HTMLInputElement;
    await fetchConverter(selectRightId?.value, target.value);
    if (target.value !== selectRightId.value) {
      inputValueLeft = pair.conversion_rate * inputValueRight;
    } else {
      inputValueLeft = inputValueRight;
    }
  }

  async function changeValueRight() {
    const selectLeftId = document.querySelector('#select-left') as HTMLInputElement;
    const selectRightId = document.querySelector('#select-right') as HTMLInputElement;
    if (currentCurrencyLeft !== selectLeftId.value || currentCurrencyRight !== selectRightId.value) {
      await fetchConverter(selectLeftId.value, selectRightId.value);
    }

    if (selectLeftId.value !== selectRightId.value) {
      inputValueRight = pair.conversion_rate * inputValueLeft;
    } else {
      inputValueRight = inputValueLeft;
    }
  }

  async function changeValueLeft() {
    const selectLeftId = document.querySelector('#select-left') as HTMLInputElement;
    const selectRightId = document.querySelector('#select-right') as HTMLInputElement;
    if (currentCurrencyLeft !== selectRightId.value || currentCurrencyRight !== selectLeftId.value) {
      await fetchConverter(selectRightId.value, selectLeftId.value);
    }

    if (selectLeftId.value !== selectRightId.value) {
      inputValueLeft = pair.conversion_rate * inputValueRight;
    } else {
      inputValueLeft = inputValueRight;
    }
  }

  async function fetchConverter(currencyLeft = 'USD', currencyRight = 'USD') {
    try {
      currentCurrencyLeft = currencyLeft;
      currentCurrencyRight = currencyRight;

      const response = await fetch(`https://v6.exchangerate-api.com/v6//8956c6ae534857b7e6bb0e54/pair/${currencyLeft}/${currencyRight}`);
      if (!response.ok) {
        throw new Error('Ошибка при выполнении запроса');
      }
      pair = await response.json();
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
  }

  async function fetchData() {
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/8956c6ae534857b7e6bb0e54/latest/USD`);
      if (!response.ok) {
        throw new Error('Ошибка при выполнении запроса');
      }
      data = await response.json();
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
  }

  fetchData();
</script>

<main>
  <h1>Конвертер валют</h1>

  <div class="block">
    <input class="input" type="number" bind:value={inputValueLeft} on:input={changeValueRight} />

    <select class="select" name="before" id="select-left" on:change={(event) => selectLeft(event)}>
      {#if data && data.conversion_rates}
        {#each Object.keys(data?.conversion_rates) as key}
          <option value={key}>{key}</option>
        {/each}
      {:else}
        <option>...</option>
      {/if}
    </select>
  </div>

  <p class="arrows"> 🠕🠗 </p>

  <div class="block">
    <input class="input" type="number" bind:value={inputValueRight} on:input={changeValueLeft} />

    <select class="select" name="after" id="select-right" on:change={(event) => selectRight(event)}>
      {#if data && data.conversion_rates}
        {#each Object.keys(data.conversion_rates) as key}
          <option value={key}>{key}</option>
        {/each}
      {:else}
        <option>...</option>
      {/if}
    </select>
  </div>

</main>

<style>
  .block {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  .input {
    border: none;
    border-bottom: 1px solid black;
    font-size: 20px;
  }

  .input:focus {
    outline: none;
  }

  .select {
    font-size: 20px;
  }

  .arrows {
    margin: 10px;
    font-size: 40px;
  }
</style>
