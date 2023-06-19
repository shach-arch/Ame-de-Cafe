<!-- DiscountCodeInput.svelte -->
<script>
    let discountCode = '';
    let isCodeValid = false;
    let discountAmount = 0;
  
    const validDiscountCodes = [
      { code: 'SUMMER25', discount: 0.25 },
      { code: 'SALE50', discount: 0.5 },
      // Add more valid discount codes if needed
    ];
  
    function applyDiscountCode() {
      const enteredCode = discountCode.trim().toUpperCase();
      const matchedCode = validDiscountCodes.find((code) => code.code === enteredCode);
  
      if (matchedCode) {
        // Code is valid
        isCodeValid = true;
        discountAmount = matchedCode.discount;
  
        // Update the total price after applying the discount
        updateTotalPrice();
      } else {
        // Code is invalid
        isCodeValid = false;
        discountAmount = 0;
      }
    }
  
    // Update the total price when the selected coffee or donut changes
    function updateTotalPrice() {
      const selectedCoffeePrice = parseFloat(selectedCoffeePrice);
      const donutPrice = parseFloat(donutPrice);
      const discountedPrice = (selectedCoffeePrice + donutPrice) * (1 - discountAmount);
  
      totalPrice.set(discountedPrice);
    }
  </script>
  
  <div>
    <input type="text" bind:value="{discountCode}" />
    <button on:click="{applyDiscountCode}">Apply Code</button>
  
    {#if isCodeValid}
      <p>Discount code applied!</p>
    {/if}
  </div>
  