<script>
  import { createClient } from "@supabase/supabase-js";
  import { afterUpdate, onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import DiscountCodeInput from "./DiscountCodeInput.svelte";
  import OrderTracker from "./OrderTracker.svelte";
  export const itemsInCart = writable(0);
  export const totalCost = writable(0);


  const url = "https://ujnattukwsqsjmzuhyoh.supabase.co";
  const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1OTUyMDgsImV4cCI6MjAwMTE3MTIwOH0.G9dIZVpPY5ylDQD63YRjGFGuP3LGtECuQndt8OdxtZM";
  const supabase = createClient(url, anonKey);

  const orderStatus = writable("Pending");

  let filterOn = false;
  let productList = loadData();
  let cartList = [];

  // Load everything in the Products database
  async function loadData() {
    try {
      const { data } = await supabase.from("Products").select();
      return data;
    } catch (error) {
      console.error("Error fetching data from Supabase:", error);
      return error;
    }
  }

  async function filter(group) {
    filterOn = true;
    try {
      const { data } = await supabase
        .from("Products")
        .select()
        .match({ product_group: group });
      data.forEach((item) => console.log("HI_ "+item.product));
      return data;
    } catch (error) {
      console.error("Error fetching data from Supabase:", error);
      return error;
    }
  }

  // Checkbox
  let smallYes = false;
  let largeYes = false;

  // Update the total price when the selected coffee or donut changes
  function updateOrderStatus(status) {
    orderStatus.set(status);
  }

  function addToCart() {
    itemsInCart.update((items) => items + 1);
  }
 
  function updateTotalPrice() {
    const priceElement = document.getElementById("currentPrice");
    const priceValue = priceElement.innerHTML;
    const priceWithoutSymbol = priceValue.replace("$", ""); // Remove the "$" symbol
    const cost = parseFloat(priceWithoutSymbol);

    if (!isNaN(cost)) {
      totalCost.update((total) => {
        const updatedTotal = total + cost;
        const formattedTotal = updatedTotal.toFixed(2); // Format the total to 2 decimal places
        console.log("Total cost:", formattedTotal);
        return parseFloat(formattedTotal); // Return the formatted total as a number
      });
    } else {
      console.log("Invalid price value:", priceValue);
    }
  }

  function submitOrder(item) {
    cartList.push(item);
    console.log(cartList);

    // Order submitted
    updateOrderStatus("Submitted");
    // Handle submitting the order
    console.log("Order submitted!");

    const button = document.getElementById("buyButton");
    const loadingScreen = document.getElementById("loadingScreen");

    button.setAttribute("disabled", "disabled");
    loadingScreen.style.display = "block";

    // Perform the desired action (e.g., form submission, API call, etc.)
    // After the action is complete, hide the loading screen and enable the button again
    setTimeout(() => {
      loadingScreen.style.display = "none";
      button.removeAttribute("disabled");
    }, 2000);
    addToCart();
    updateTotalPrice();
  }

  let showCreditCardPrompt = false;
  let creditCardPromptElement;
  function showPrompt() {
    sessionStorage.setItem("jsArray", JSON.stringify(cartList));
    window.location.replace("cart.html");
  }
  function closePrompt() {
    const prompt = document.getElementById("CreditCard");
    prompt.style.display = "none";
  }
  

  function handlePayment(event) {
    event.preventDefault();
    const cardNumber = event.target.elements.cardNumber.value;
    const expiryDate = event.target.elements.expiryDate.value;
    const cvv = event.target.elements.cvv.value;
    // Perform payment processing or API call with the provided credit card information
    console.log("Card Number:", cardNumber);
    console.log("Expiry Date:", expiryDate);
    console.log("CVV:", cvv);

    // Reset the form and hide the credit card prompt
    event.target.reset();
    showCreditCardPrompt = false;
  }
  function restrictToNumbers(event) {
    const input = event.target;
    const inputValue = input.value;
    input.value = inputValue.replace(/[^0-9]/g, "");
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

<main>
  <div class="d-flex flex-column flex-lg-row">
    <!-- Side Bar -->
    <section class="p-2">
      <button
        class="btn btn-primary d-lg-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasResponsive"
        aria-controls="offcanvasResponsive">Show Filters</button
      >

      <div class="flex-shrink-0 p-3 d-none d-lg-block" style="width: 240px;">
        <h3 class="fs-5 fw-semibold">Filters</h3>
      </div>

      <!-- Offcanvas -->
      <div
        class="offcanvas-lg offcanvas-start"
        tabindex="-1"
        id="offcanvasResponsive"
        aria-labelledby="offcanvasResponsiveLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasResponsiveLabel">Filters</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            data-bs-target="#offcanvasResponsive"
            aria-label="Close"
          />
        </div>

        <!-- Body -->
        <div class="offcanvas-body">
          <ul class="list-unstyled ps-0">
            <li class="mb-1">
              <button
                class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#home-collapse"
                aria-expanded="false"
              >
                Menu
              </button>
              <div class="collapse" id="home-collapse" style="">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li>
                    <a
                      href="#"
                      class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                      data-bs-dismiss="offcanvas"
                      data-bs-target="#offcanvasResponsive"
                      on:click={() => (productList = filter("Coffee"))}
                      >Coffee</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                      data-bs-dismiss="offcanvas"
                      data-bs-target="#offcanvasResponsive"
                      on:click={() => (productList = filter("Teas"))}>Tea</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                      data-bs-dismiss="offcanvas"
                      data-bs-target="#offcanvasResponsive"
                      on:click={() => (productList = filter("Food"))}>Food</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                      data-bs-dismiss="offcanvas"
                      data-bs-target="#offcanvasResponsive"
                      on:click={() => (productList = filter("Beverages"))}
                      >Beverages</a
                    >
                  </li>
                </ul>
              </div>
            </li>
            <li class="mb-1">
              <button
                class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#dashboard-collapse"
                aria-expanded="false"
              >
                Sizes
              </button>
              <div class="collapse" id="dashboard-collapse">
                <ul class="list-group small">
                  <li class="list-group-item">
                    <input
                      class="form-check-input me-1"
                      type="checkbox"
                      bind:checked={smallYes}
                      value=""
                      id="smCheckbox"
                    />
                    <label class="form-check-label" for="smCheckbox"
                      >Small</label
                    >
                  </li>
                  <li class="list-group-item">
                    <input
                      class="form-check-input me-1"
                      type="checkbox"
                      bind:checked={largeYes}
                      value=""
                      id="lgCheckbox"
                    />
                    <label class="form-check-label" for="lgCheckbox"
                      >Large</label
                    >
                  </li>
                </ul>
              </div>
            </li>
            <li class="mb-1">
              <button
                class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#orders-collapse"
                aria-expanded="false"
              >
                Orders
              </button>
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
            </li>
            <li class="border-top my-3" />
            <li class="mb-1">
              <button
                class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#account-collapse"
                aria-expanded="false"
              >
                Cart
              </button>
              <div class="collapse" id="account-collapse">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li
                    class="link-dark d-inline-flex text-decoration-none rounded"
                  >
                    <a
                      href="#"
                      class="link-dark d-inline-flex text-decoration-none rounded"
                      >Items: {$itemsInCart}</a
                    >
                  </li>

                  <li>
                    <button
                      class="link-dark d-inline-flex text-decoration-none rounded mt-2 ms-4 mb-3"
                      data-bs-dismiss="offcanvas"
                      data-bs-target="#offcanvasResponsive"
                      id="checkoutButton"
                      on:click={showPrompt}>Checkout</button
                    >
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="p-2 flex-fill scroll">
      {#await productList}
        <p>...waiting</p>
      {:then data}
        {#each data as item}
          <div class="row justify-content-center mb-3">
            <div class="col-md-12">
              <div class="card shadow-0 border rounded-3">
                <div class="card-body">
                  <div class="row g-0">
                    <div
                      class="col-xl-3 col-md-4 d-flex justify-content-center"
                    >
                      <div
                        class="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0"
                      >
                        <img
                          src="./static/images/{item.product_group}.jpg"
                          class="w-100 h-100 img-fluid rounded"
                          alt="{item.product_group}.png"
                        />
                        <a href="#!">
                          <div class="hover-overlay">
                            <div
                              class="mask"
                              style="background-color: rgba(253, 253, 253, 0.15);"
                            />
                          </div>
                        </a>
                      </div>
                    </div>

                    <div class="col-xl-6 col-md-5 col-sm-7">
                      <h5>{item.product}</h5>
                      <div class="d-flex flex-row">
                        <div class="text-warning mb-1 me-2">
                          <i class="fa fa-star" />
                          <i class="fa fa-star" />
                          <i class="fa fa-star" />
                          <i class="fa fa-star" />
                          <i class="fas fa-star-half-alt" />
                          <span class="ms-1"> 4.5 </span>
                          <br />
                        </div>
                      </div>

                      <p class="text mb-4 mb-md-0">
                        {item.product_description}
                      </p>
                    </div>
                    <div class="col-xl-2 col-md-3 col-sm-5">
                      <div class="d-flex flex-row align-items-center mb-1">
                        <p id="currentPrice">{item.current_retail_price}</p>
                      </div>
                      <div class="mt-4">
                        <button
                          class="btn btn-primary shadow-0"
                          type="button"
                          id="buyButton"
                          on:click={() => submitOrder(item)}>Buy this</button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      {:catch error}
        <p style="color: red">{error.message}</p>
      {/await}

      <div id="loadingScreen" style="display: none;">
        <!-- Placeholder for loading screen -->
        Loading...
      </div>
    </section>
    <hr />

    <!-- Add this element to display the prompt -->
    <section>
      <div id="CreditCard" class="card-prompt" style="display: none">
        <h2>Enter Credit Card Information</h2>
        <form class="form-horizontal" on:submit={handlePayment}>
          <div class="form-group">
            <label for="cardNumber">Card Number:</label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                id="cardNumber"
                placeholder="Card Number"
                on:input={restrictToNumbers}
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label for="expiryDate">Expiry Date:</label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YYYY"
                on:input={restrictToNumbers}
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label for="cvv">CVV:</label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                id="cvv"
                name="cvv"
                placeholder="CVV"
                on:input={restrictToNumbers}
                required
              />
            </div>
          </div>
          <button type="submit">Pay Now</button>
          <button class="close-button" on:click={closePrompt}>Close</button>
        </form>
      </div>
    </section>
  </div>
</main>

<style>
  button {
    color: darksalmon;
    border: 2px solid darksalmon;
    background-color: white;
  }

  button:hover {
    background-color: darksalmon;
    transition: 0.7s;
  }

  .scroll {
    height: 67.5rem;
    overflow-y: scroll;
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
