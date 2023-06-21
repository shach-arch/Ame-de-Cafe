<!-- DiscountCodeInput.svelte -->
<script>
  import { writable } from 'svelte/store';

  export let totalCost;
  export const total = writable(totalCost || 0); // Initialize with a default value of 0

  let discountCode = '';
  let isCodeValid = false;
  let discountAmount = 0;

  const discountCodes = {
    CODE1: 0.1, // 10% discount
    CODE2: 0.2, // 20% discount
    SALE50: 0.5, // 50% discount
  };

  function applyDiscountCode(discountCode) {
    const enteredCode = discountCode.trim().toUpperCase();
    const discountAmount = discountCodes[enteredCode];

    if (discountAmount) {
      // Code is valid
      isCodeValid = true;
      total.update(currentTotal => {
        const discountedTotal = currentTotal - currentTotal * discountAmount;
        console.log("Discount applied:", discountAmount * 100 + "%");
        console.log("Cost after discount:", discountedTotal);
        return discountedTotal;
      });
    } else {
      // Code is invalid
      isCodeValid = false;
      console.log("Invalid discount code:", discountCode);
    }
  }
</script>

<div>
  <input type="text" bind:value="{discountCode}" />
  <button on:click="{() => applyDiscountCode(discountCode)}">Apply Code</button>

  {#if isCodeValid}
    <p>Discount code applied!</p>
    <p>Cost after discount: ${$total}</p>
  {/if}
</div>

