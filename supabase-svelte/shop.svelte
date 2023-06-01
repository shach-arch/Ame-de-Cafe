<script>
  import { createClient } from "@supabase/supabase-js";
  import { onMount } from "svelte";
  import { readable, get } from "svelte/store";

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

  let selectedCoffee = "";
  let selectedDonut = "";
  let totalPrice = 0;

  const productOptions = readable([], (set) => {
    fetch(
      "https://api.supabase.io/v1/table/product?select=*&product_group=eq.{productGroup}",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "Bearer ZjMfEockQY0LjZm3KmajSkZHVRPNRQHPABeM73lbWCvQTk1GriNVjg7Q9qqOB0d/2Y5HNz++1ds3x7AuGn78pg==",
        },
        mode: "no-cors",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => set(data))
      .catch((error) => console.error(error));
  });

  const coffeeOptions = readable([], (set) => {
    const unsubscribe = productOptions.subscribe((value) => {
      const options = value.filter(
        (product) => product.product_group === "coffee"
      );
      set(options);
    });
    return unsubscribe;
  });

  const donutOptions = readable([], (set) => {
    const unsubscribe = productOptions.subscribe((value) => {
      const options = value.filter(
        (product) => product.product_group === "food"
      );
      set(options);
    });
    return unsubscribe;
  });

  function updateTotalPrice() {
    const coffeePrice =
      get(coffeeOptions).find((coffee) => coffee.name === selectedCoffee)
        ?.price || 0;
    const donutPrice =
      get(donutOptions).find((donut) => donut.name === selectedDonut)?.price ||
      0;
    totalPrice = coffeePrice + donutPrice;
  }

  function submitOrder() {
    // Handle submitting the order
    console.log("Order submitted!");
    console.log("Selected coffee:", selectedCoffee);
    console.log("Selected donut:", selectedDonut);
    console.log("Total price:", totalPrice);
  }

  onMount(() => {
    updateTotalPrice();
  });
</script>

<main>
  <h1>Order Page</h1>

  <form on:submit|preventDefault={submitOrder}>
    <label for="coffee">Select Coffee:</label>
    <select
      id="coffee"
      bind:value={selectedCoffee}
      on:change={updateTotalPrice}
    >
      <option value="">-- Choose a coffee --</option>
      {#each $coffeeOptions as coffee}
        <option value={coffee.name}>{coffee.name}</option>
      {/each}
    </select>

    <label for="donut">Select Donut:</label>
    <select id="donut" bind:value={selectedDonut} on:change={updateTotalPrice}>
      <option value="">-- Choose a donut --</option>
      {#each $donutOptions as donut}
        <option value={donut.name}>{donut.name}</option>
      {/each}
    </select>

    <p>Total Price: ${totalPrice.toFixed(2)}</p>

    <button type="submit" disabled={!(selectedCoffee && selectedDonut)}
      >Place Order</button
    >
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
