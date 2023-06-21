<script>
  import { createClient } from "@supabase/supabase-js";
  import { onMount } from "svelte";
  import { writable, get } from "svelte/store";
  // import { getStores, navigating, page, updated } from '$app/stores';
  // import { Pagination } from 'flowbite-svelte'

  const url = "https://ujnattukwsqsjmzuhyoh.supabase.co";

  const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1OTUyMDgsImV4cCI6MjAwMTE3MTIwOH0.G9dIZVpPY5ylDQD63YRjGFGuP3LGtECuQndt8OdxtZM";

  const supabase = createClient(url, anonKey);

  const coffeeOptions = writable([]); // Declare and initialize coffeeOptions variable
  const donutOptions = writable([]); // Declare and initialize donutOptions variable
  const totalPrice = writable(0); // Declare and initialize totalPrice variable
  const orderStatus = writable("Pending");
  const cartCount = writable(0); // Declare and initialize cartCount variable

  let selectedDonut = ""; // Declare and initialize selectedDonut variable
  let selectedCoffee = ""; // Declare and initialize selectedCoffee variable

  let filterOn = false;
  let productList = loadData();

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
      data.forEach((item) => console.log(item.product));
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
  async function updateTotalPrice() {
    try {
      const { data: coffeeData } = await supabase
        .from("Products")
        .select("product,current_wholesale_price")
        .match({ product_group: "Whole Bean/Teas" });

      const selectedCoffeePrice =
        coffeeData.find((coffee) => coffee.product === selectedCoffee)
          ?.current_wholesale_price || 0;

      const { data: donutData } = await supabase
        .from("Products")
        .select("product,current_wholesale_price")
        .match({ product_group: "Food" });

      const donutPrice =
        donutData.find((donut) => donut.product === selectedDonut)
          ?.current_wholesale_price || 0;

      totalPrice.set(parseFloat(selectedCoffeePrice) + parseFloat(donutPrice));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error);
    }
  }
  // Fetch the price for "Espresso Roast" from the database
  async function fetchEspressoRoastPrice() {
    try {
      const { data } = await supabase
        .from("Products")
        .select("current_wholesale_price")
        .match({ product: "Espresso Roast" })
        .single();

      const espressoRoastPrice = parseFloat(data?.current_wholesale_price || 0);
      return espressoRoastPrice;
    } catch (error) {
      console.error("Error fetching data from Supabase:", error);
      return {
        price: 0,
      };
    }
  }
  async function fetchCivetCatPrice() {
    try {
      const { data } = await supabase
        .from("Products")
        .select("current_wholesale_price")
        .match({ product: "Civet Cat" })
        .single();

      const civetCatPrice = parseFloat(data?.current_wholesale_price || 0);
      return civetCatPrice;
    } catch (error) {
      console.error("Error fetching data from Supabase:", error);
      return {
        price: 0,
      };
    }
  }

  function updateOrderStatus(status) {
    orderStatus.set(status);
  }

  function addToCart() {
    cartCount.update((count) => count + 1);
  }

  function submitOrder() {
    // Order submitted
    updateOrderStatus("Submitted");
    // Handle submitting the order
    console.log("Order submitted!");
    console.log("Selected coffee:", selectedCoffee);
    console.log("Selected donut:", selectedDonut);
    console.log("Total price:", totalPrice);

    const button = document.getElementById("myButton");
    const loadingScreen = document.getElementById("loadingScreen");

    button.addEventListener("click", () => {
      button.setAttribute("disabled", "disabled");
      loadingScreen.style.display = "block";

      // Perform the desired action (e.g., form submission, API call, etc.)
      // After the action is complete, hide the loading screen and enable the button again
      setTimeout(() => {
        loadingScreen.style.display = "none";
        button.removeAttribute("disabled");
      }, 2000);
    });
    // Credit card processing would go here
    const CreditCard = document.getElementById("CreditCard");
    if (CreditCard) {
      CreditCard.style.display = "block";
    }
    addToCart();
  }

  // Fetch products that match the specified product groups
  const coffeeGroups = ["Whole Bean/Teas", "Beverages"];

  supabase
    .from("Products")
    .select("product")
    .in("product_group", coffeeGroups)
    .then(({ data }) => {
      const coffeeProducts = data.map((item) => item.product);
      coffeeOptions.set(coffeeProducts);
    });

  // Fetch products that match the specified product groups
  const donutGroups = ["Food"];
  supabase
    .from("Products")
    .select("product")
    .in("product_group", donutGroups)
    .then(({ data }) => {
      const donutProducts = data.map((item) => item.product);
      donutOptions.set(donutProducts);
    });
  onMount(() => {
    updateTotalPrice();
  });
</script>

<head>
  <!-- basic -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- mobile metas -->
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
  <!-- site metas -->
  <title>Store</title>

  <!-- bootstrap css -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
    crossorigin="anonymous"
  />
  <link rel="stylesheet" href="./src/css/sidebars.css" />
</head>

<body>
  <!-- Top Nav -->
  <section class="noScroll">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img
            src="src/images/favicon.ico"
            alt="Logo"
            width="30"
            height="24"
            class="d-inline-block align-text-top"
          />
          Ame de cafe Express
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="./home.html"
                >Home</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="./shop.html">Shop</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="./events.html">Events</a>
            </li>
          </ul>
          <span class="navbar-text"> Login </span>
        </div>
      </div>
    </nav>
  </section>

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
                      on:click={() => (productList = filter("Coffee"))}
                      >Coffee</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                      on:click={() => (productList = filter("Teas"))}>Tea</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                      on:click={() => (productList = filter("Food"))}>Food</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="link-body-emphasis d-inline-flex text-decoration-none rounded"
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
                      >New</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                      >Processed</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                      >Shipped</a
                    >
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
                      >Items: <span id="cartCount"> 0</span></a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="link-dark d-inline-flex text-decoration-none rounded"
                    >
                      Selected Item Price: <span id="selectedPrice">0</span></a
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
    <section class="p-3 mb-3 flex-fill scroll">
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
                        <p>{item.current_retail_price}</p>
                      </div>
                      <div class="mt-4">
                        <button class="btn btn-primary shadow-0" type="button"
                          >Buy this</button
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

      <hr />
    </section>
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

  .scroll {
    height: 1080px;
    overflow-y: scroll;
  }

  .noScroll {
    overflow-y: hidden;
  }
</style>
