<script>
  import { createClient } from "@supabase/supabase-js";
  import { onMount } from "svelte";
  import { writable, get } from "svelte/store";


  const url = "https://ujnattukwsqsjmzuhyoh.supabase.co";

  const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1OTUyMDgsImV4cCI6MjAwMTE3MTIwOH0.G9dIZVpPY5ylDQD63YRjGFGuP3LGtECuQndt8OdxtZM";

  const supabase = createClient(url, anonKey);
  
  
  async function fetchAll() {
    let { data: Products, error } = await supabase.from("Products").select("*");

    if ((error = null)) {
      console.log(error);
    } else {
      console.log(Products);
    }
  }

  fetchAll();


  const coffeeOptions = writable([]);// Declare and initialize coffeeOptions variable
  const donutOptions = writable([]);// Declare and initialize donutOptions variable
  const totalPrice = writable(0);// Declare and initialize totalPrice variable

  let selectedDonut = ""; // Declare and initialize selectedDonut variable
  let selectedCoffee = ""; // Declare and initialize selectedCoffee variable


  // Update the total price when the selected coffee or donut changes
  async function updateTotalPrice() {
  try {
    const { data: coffeeData } = await supabase
      .from('Products')
      .select('product,current_retail_price')
      .match({ product_group: 'Whole Bean/Teas' });

    const selectedCoffeePrice = coffeeData.find((coffee) => coffee.product === selectedCoffee)?.current_retail_price || 0;

    const { data: donutData } = await supabase
      .from('Products')
      .select('product,current_retail_price')
      .match({ product_group: 'Food' });

    const donutPrice = donutData.find((donut) => donut.product === selectedDonut)?.current_retail_price || 0;

    totalPrice.set(parseFloat(selectedCoffeePrice) + parseFloat(donutPrice));
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
  }
}
  
  function submitOrder() {
    // Handle submitting the order
    console.log("Order submitted!");
    console.log("Selected coffee:", selectedCoffee);
    console.log("Selected donut:", selectedDonut);
    console.log("Total price:", totalPrice);
  }

 // Fetch products that match the specified product groups
const coffeeGroups = ['Whole Bean/Teas', 'Beverages'];

supabase
  .from('Products')
  .select('product')
  .in('product_group', coffeeGroups)
  .then(({ data }) => {
    const coffeeProducts = data.map((item) => item.product);
    coffeeOptions.set(coffeeProducts);
  })

// Fetch products that match the specified product groups
const donutGroups = ['Food'];  
supabase
  .from('Products')
  .select('product')
  .in('product_group', donutGroups)
  .then(({ data }) => {
    const donutProducts = data.map((item) => item.product);
    donutOptions.set(donutProducts);
  })  
  onMount(() => {
    updateTotalPrice();
  });
</script>

<main>
  <h1>Order Page</h1>

  <form on:submit|preventDefault={submitOrder}>
    <label for="coffee">Select Coffee:</label>
    <select id="coffee" bind:value={selectedCoffee} on:change={updateTotalPrice}>
      <option value="">-- Choose a coffee --</option>
      {#each $coffeeOptions as coffee}
        <option value={coffee}>{coffee}</option>
      {/each}
    </select>
  
    <label for="donut">Select Donut:</label>
    <select id="donut" bind:value={selectedDonut} on:change={updateTotalPrice}>
      <option value="">-- Choose a donut --</option>
      {#each $donutOptions as donut}
        <option value={donut}>{donut}</option>
      {/each}
    </select>
  
    <p>Total Price: ${$totalPrice.toFixed(2)}</p>

  
    <button type="submit" disabled={!(selectedCoffee && selectedDonut)}>Place Order</button>
  </form>
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  h1 {
    text-align: center;
  }
  form {
    display: inline;
  }
  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  button {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    background-color: #fff;
    cursor: pointer;
  }
  button:hover {
    background-color: #f5f5f5;
  }
</style>
