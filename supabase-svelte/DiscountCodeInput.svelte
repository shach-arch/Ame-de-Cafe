<!-- DiscountCodeInput.svelte -->
<script>
  import { writable } from 'svelte/store';

  export let subtotalCost;
  export const isCodeValid = writable(false);
  export const discountAmount = writable(0);

  let discountCode = '';

  const discountCodes = {
    CODE1: 0.1, // 10% discount
    CODE2: 0.2, // 20% discount
    SALE50: 0.5, // 50% discount
  };

  function applyDiscountCode() {
    const enteredCode = discountCode.trim().toUpperCase();
    const discount = discountCodes[enteredCode];

    if (discount) {
      // Code is valid
      isCodeValid.set(true);
      discountAmount.set(discount);
      const updatedTotal = calculateDiscountedTotal(discount);
      subtotalCost.set(updatedTotal);
    } else {
      // Code is invalid
      isCodeValid.set(false);
      discountAmount.set(0);
    }
  }

  function calculateDiscountedTotal(discount) {
    const currentTotal = $subtotalCost;
    const discountedTotal = currentTotal - currentTotal * discount;
    return discountedTotal;
  }
</script>

<div>
  <input type="text" bind:value="{discountCode}" />
  <button on:click="{applyDiscountCode}">Apply Code</button>

  {#if $isCodeValid}
    <p>Discount code applied!</p>
    <p>Discount amount: {($discountAmount * 100).toFixed(0)}%</p>
  {/if}
</div>
<style>
  button {
    color: darksalmon;
    border: 2px solid darksalmon;
    background-color: white;
  }
</style>