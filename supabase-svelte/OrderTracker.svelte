<!-- OrderTracker.svelte -->
<script>
  import { createClient } from "@supabase/supabase-js";
  import { orderStatus } from './orderStatus.js';
  
  const url = "https://ujnattukwsqsjmzuhyoh.supabase.co";
  
  const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1OTUyMDgsImV4cCI6MjAwMTE3MTIwOH0.G9dIZVpPY5ylDQD63YRjGFGuP3LGtECuQndt8OdxtZM";
  
  const supabase = createClient(url, anonKey);
    let orderId = '';
    let orderStatusValue = '';
  
    async function trackOrder() {
      // Fetch the order status from Supabase based on the entered orderId
      try {
        const { data, error } = await supabase
          .from('Orders')
          .select('status')
          .eq('order_id', orderId)
          .single();
  
        if (error) {
          console.error('Error fetching order status:', error);
        } else {
          if (data) {
            // Update the orderStatusValue with the fetched status
            orderStatusValue = data.status;
          } else {
            orderStatusValue = 'Order not found';
          }
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    }
  </script>
    
    <div>
      <h2>Order Tracker</h2>
      <form on:submit|preventDefault="{trackOrder}">
        <label for="orderId">Order ID:</label>
        <input type="text" id="orderId" bind:value="{orderId}" />
        <button type="submit">Track</button>
      </form>
      {#if orderStatusValue}
        <p>Status: {orderStatusValue}</p>
      {/if}
    </div>
    