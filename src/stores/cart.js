// src/stores/cart.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // Memuat keranjang dari localStorage
  const items = ref(JSON.parse(localStorage.getItem('cartItems')) || []);

  const saveCartToLocalStorage = () => {
    localStorage.setItem('cartItems', JSON.stringify(items.value));
  };

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  });

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  function addItem(product, quantity = 1) {
    const existingItem = items.value.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Hanya simpan data yang relevan untuk mengurangi size localStorage
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        stock: product.stock,
        quantity: quantity
      });
    }
    saveCartToLocalStorage();
  }

  function updateQuantity(itemId, newQuantity) {
    const item = items.value.find(item => item.id === itemId);
    if (item && newQuantity > 0) {
      if(newQuantity > item.stock) {
        alert(`Stok tidak mencukupi. Sisa stok: ${item.stock}`);
        item.quantity = item.stock;
      } else {
        item.quantity = newQuantity;
      }
    } else if (item && newQuantity <= 0) {
      removeItem(itemId);
    }
    saveCartToLocalStorage();
  }

  function removeItem(itemId) {
    items.value = items.value.filter(item => item.id !== itemId);
    saveCartToLocalStorage();
  }

  function clearCart() {
    items.value = [];
    localStorage.removeItem('cartItems');
  }

  return { items, subtotal, totalItems, addItem, updateQuantity, removeItem, clearCart };
}, );
