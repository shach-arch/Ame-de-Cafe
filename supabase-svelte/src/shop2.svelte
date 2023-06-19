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
</head>

<body>
    <!-- Top Nav -->
    <section>
      <div class="header_section header_bg s-zK8PAMszfbUo">
        <div class="container-fluid s-zK8PAMszfbUo">
          <nav
            class="navbar navbar-expand-lg navbar-light bg-light s-zK8PAMszfbUo"
          >
            <a class="navbar-brand s-zK8PAMszfbUo" href="home.html"
              ><img src="src/images/favicon.ico" class="s-zK8PAMszfbUo" /></a
            >
            <p class="logo_text s-zK8PAMszfbUo">Ame de cafe Express</p>
            <button
              class="navbar-toggler s-zK8PAMszfbUo"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              ><span class="navbar-toggler-icon s-zK8PAMszfbUo" /></button
            >
            <div
              class="collapse navbar-collapse s-zK8PAMszfbUo"
              id="navbarSupportedContent"
            >
              <ul class="navbar-nav ml-auto s-zK8PAMszfbUo">
                <li class="nav-item s-zK8PAMszfbUo">
                  <a class="nav-link s-zK8PAMszfbUo" href="./home.html">Home</a>
                </li>
                <li class="nav-item s-zK8PAMszfbUo">
                  <a class="nav-link s-zK8PAMszfbUo" href="./shop.html">Shop</a>
                </li>
                <li class="nav-item active s-zK8PAMszfbUo">
                  <a class="nav-link s-zK8PAMszfbUo" href="./events.html"
                    >Events</a
                  >
                </li>
              </ul>
              <form class="form-inline my-2 my-lg-0 s-zK8PAMszfbUo">
                <div class="login_bt s-zK8PAMszfbUo">
                  <ul class="s-zK8PAMszfbUo">
                    <li class="s-zK8PAMszfbUo">
                      <a href="#" class="s-zK8PAMszfbUo"
                        ><span class="user_icon s-zK8PAMszfbUo"
                          ><i
                            class="fa fa-user s-zK8PAMszfbUo"
                            aria-hidden="true"
                          /></span
                        >Login</a
                      >
                    </li>
                  </ul>
                </div>
              </form>
            </div>
          </nav>
        </div>
      </div>

      <nav
        class="navbar navbar-dark bg-dark"
        aria-label="Dark offcanvas navbar"
      >
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Dark offcanvas navbar</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbarDark"
            aria-controls="offcanvasNavbarDark"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon" />
          </button>
          <div
            class="offcanvas offcanvas-end text-bg-dark"
            tabindex="-1"
            id="offcanvasNavbarDark"
            aria-labelledby="offcanvasNavbarDarkLabel"
          >
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasNavbarDarkLabel">
                Offcanvas
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#"
                    >Home</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Link</a>
                </li>
                <li class="nav-item dropdown">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Dropdown
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li>
                      <a class="dropdown-item" href="#">Another action</a>
                    </li>
                    <li>
                      <hr class="dropdown-divider" />
                    </li>
                    <li>
                      <a class="dropdown-item" href="#">Something else here</a>
                    </li>
                  </ul>
                </li>
              </ul>
              <form class="d-flex mt-3" role="search">
                <input
                  class="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button class="btn btn-outline-success" type="submit"
                  >Search</button
                >
              </form>
            </div>
          </div>
        </div>
      </nav>
    </section>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
  </body>

<style>
  /* button {
    color: darksalmon;
    border: 2px solid darksalmon;
    background-color: white;
  } */
</style>
