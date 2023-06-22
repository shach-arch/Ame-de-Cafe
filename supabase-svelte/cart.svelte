<script>
    import { createClient } from "@supabase/supabase-js";
    import { afterUpdate,onMount } from "svelte";
    import { writable, derived  } from "svelte/store";
    import DiscountCodeInput from './DiscountCodeInput.svelte';
    import OrderTracker from "./OrderTracker.svelte";
    // import { getStores, navigating, page, updated } from '$app/stores';
    // import { Pagination } from 'flowbite-svelte'
    export const itemsInCart = writable(0);
    export const totalCost = writable(0);
    export const discountAmount = writable(0);
    export const isCodeValid = false;
    export const applyDiscountCode = writable([]);
    
    const url = "https://ujnattukwsqsjmzuhyoh.supabase.co";
  
    const anonKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1OTUyMDgsImV4cCI6MjAwMTE3MTIwOH0.G9dIZVpPY5ylDQD63YRjGFGuP3LGtECuQndt8OdxtZM";
  
    const supabase = createClient(url, anonKey);
  
    const coffeeOptions = writable([]); // Declare and initialize coffeeOptions variable
    const donutOptions = writable([]); // Declare and initialize donutOptions variable
    const orderStatus = writable("Pending");
    
    let filterOn = false;
    let productList = loadData();
    
  
  
    async function filter(group) {
      filterOn = true;
      try {
        const { data } = await supabase
          .from("Products")
          .select()
          .match({ product_group: group });
        data.forEach((item) => console.log(item.product));
        return data;
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
        return error;
      }
    }
  
  
    // Update the total price when the selected coffee or donut changes
    function updateOrderStatus(status) {
      orderStatus.set(status);
    }
  
    function addToCart() {
      itemsInCart.update(items => items + 1);
    }
    function updateTotalPrice() {
    const priceElement = document.getElementById("currentPrice");
    const priceValue = priceElement.innerHTML;
    const priceWithoutSymbol = priceValue.replace("$", ""); // Remove the "$" symbol
    const cost = parseFloat(priceWithoutSymbol);
  
    if (!isNaN(cost)) {
      totalCost.update(total => {
        const updatedTotal = total + cost;
        const formattedTotal = updatedTotal.toFixed(2); // Format the total to 2 decimal places
        console.log("Total cost:", formattedTotal);
        return parseFloat(formattedTotal); // Return the formatted total as a number
      });
    } else {
      console.log("Invalid price value:", priceValue);
    }
  }
  
   
  
    let showCreditCardPrompt = false;
    let creditCardPromptElement;
    function showPrompt() {
      const prompt = document.getElementById("CreditCard");
      prompt.style.display = "block";
    }
    function closePrompt() {
      const prompt = document.getElementById("CreditCard")
      prompt.style.display = "none";
    }
    function generateRandomId() {
    var randomNumber = Math.floor(Math.random() * 1000000); // Generates a random number between 0 and 999999
    var paddedNumber = String(randomNumber).padStart(6, '0'); // Pads the number with leading zeros to ensure it has 6 digits
    var randomId = paddedNumber; // Prefixes the number with 'ID'
    return randomId;
  }
  function handlePayment(event) {
    event.preventDefault();
    const cardNumberInput = document.getElementById('cardNumber');
    const cardNumber = cardNumberInput instanceof HTMLInputElement ? cardNumberInput.value : '';
    
    const expiryDateInput = document.getElementById('expiryDate');
    const expiryDate = expiryDateInput instanceof HTMLInputElement ? expiryDateInput.value : '';
    
    const cvvInput = document.getElementById('cvv');
    const cvv = cvvInput instanceof HTMLInputElement ? cvvInput.value : '';
  
    // Perform payment processing or API call with the provided credit card information
    console.log("Card Number:", cardNumber);
    console.log("Expiry Date:", expiryDate);
    console.log("CVV:", cvv);
  
    // Reset the form and hide the credit card prompt
    const form = event.target.closest('form');
    if (form) {
      form.reset();
    }
    showCreditCardPrompt = false;
  
    // Generate a random ID
    var id = generateRandomId();
    console.log(id);
    // Assuming orderStatus is defined and holds the order status value
    supabase
      .from('Orders')
      .insert({ order_id: id, credit_card: cardNumber, status:"pending" })
      .then(response => {
        console.log('Order inserted successfully:', response);
      })
  }
  
  
    function restrictToNumbers(event) {
      const input = event.target;
      const inputValue = input.value;
      input.value = inputValue.replace(/[^0-9]/g, '');
    }
  
    afterUpdate(() => {
      if (showCreditCardPrompt) {
        creditCardPromptElement.style.display = "block";
      }
    });
  
    onMount(() => {
      creditCardPromptElement = document.getElementById("CreditCard");
    });
  
    
     
  </script>
  
   
                <div class="collapse" id="orders-collapse">
                  <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li>
                      <a
                        href="#"
                        class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                        >Track</a>
                        <OrderTracker/>
                    </li>  
                  </ul>
                  </div>
            
                  Cart
               
                        <p>Total Price: ${$totalCost.toFixed(2)}</p>
                            <button id="checkoutButton" on:click={showPrompt}>Checkout</button>
                            <!-- Add the DiscountCodeInput component below the Total Price -->
                            <DiscountCodeInput {totalCost}/>
                   
                  <!-- Add this element to display the prompt -->
                  <div id="CreditCard" class="card-prompt" style="display: none">
                    <h2>Enter Credit Card Information</h2>
                    <form class="form-horizontal">
                      <div class="form-group">
                        <label for="cardNumber">Card Number:</label>
                        <div class="col-sm-10">
                          <input type="text" class="form-control" id="cardNumber" placeholder="Card Number" on:input={restrictToNumbers} required />
                        </div>
                      </div>
                      <div class="form-group">
                        <label for="expiryDate">Expiry Date:</label>
                        <div class="col-sm-10">
                          <input type="text" class="form-control" id="expiryDate" name="expiryDate" placeholder="MM/YYYY" on:input={restrictToNumbers} required />
                        </div>
                      </div>
                      <div class="form-group">
                        <label for="cvv">CVV:</label>
                        <div class="col-sm-10">
                          <input type="text" class="form-control" id="cvv" name="cvv" placeholder="CVV" on:input={restrictToNumbers} required />
                        </div>
                      </div>
                      <button type="submit" on:click|preventDefault={handlePayment}>Pay Now</button>
                      <button class="close-button" on:click={closePrompt}>Close</button>
                    </form>
                  </div>
                  <div id="loadingScreen" style="display: none;">
                    <!-- Placeholder for loading screen -->
                    Loading...
                  </div>                 
              <hr />
                </div>
                
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
      crossorigin="anonymous"
    ></script>
      </body>
      
  
  <style>
    button {
      color: darksalmon;
      border: 2px solid darksalmon;
      background-color: white;
    }
  
    .card-prompt {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid darksalmon;
      padding: 60px;
      background-color: lightgray;
      width: 700px;
    }
  </style>
  