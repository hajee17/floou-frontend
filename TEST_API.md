# Test API Response

Buka Browser Console di http://localhost:5174 dan jalankan:

```javascript
const token = localStorage.getItem('token');
console.log('Token:', token);

fetch('http://127.0.0.1:8000/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Full response:', data);
  console.log('✅ Orders object:', data.orders);
  console.log('✅ Orders array:', data.orders.data);
  console.log('✅ Number of orders:', data.orders.data.length);
  console.log('✅ First order:', data.orders.data[0]);
})
.catch(err => console.error('❌ Error:', err));
```

## Expected Result

Jika backend mengembalikan data dengan benar:

```
✅ Full response: {orders: {current_page: 1, data: Array(1), ...}}
✅ Orders object: {current_page: 1, data: Array(1), first_page_url: "...", ...}
✅ Orders array: [{id: 1, invoice_number: "INV-...", ...}]
✅ Number of orders: 1
✅ First order: {id: 1, user_id: 2, invoice_number: "INV-20250115-0001", ...}
```

## Jika Masih Kosong

Cek apakah benar user ID 2 (Customer) memiliki orders di database:

```sql
SELECT * FROM orders WHERE user_id = 2;
```
