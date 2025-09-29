// Menu data
const MENU = [
  { id: 'espresso', name: 'Еспресо', price: 45 },
  { id: 'doppio', name: 'Допіо', price: 60 },
  { id: 'americano', name: 'Американо', price: 45 },
  { id: 'cappuccino', name: 'Капучино', price: 65 },
  { id: 'latte', name: 'Лате', price: 70 },
  { id: 'raf', name: 'Раф', price: 75 },
  { id: 'filter', name: 'Фільтр-кава', price: 65 },
  { id: 'sandwich', name: 'Сендвічі', price: 120 },
  { id: 'croissant_savory', name: 'Круасан солоний', price: 105 },
  { id: 'croissant_sweet', name: 'Круасан солодкий', price: 115 },
  { id: 'donut', name: 'Пончики', price: 55 },
  { id: 'muffin', name: 'Мафіни', price: 85 },
  { id: 'cheesecake', name: 'Чізкейк Нью Йорк', price: 120 }
];

function formatUAH(n){
  return Number(n).toLocaleString('uk-UA');
}

// Build menu UI
const menuGrid = document.getElementById('menu-grid');
MENU.forEach(item => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="left">
      <div class="name">${item.name}</div>
      <div class="price">${item.price} грн</div>
    </div>
    <div class="qty">
      <input type="number" min="0" value="0" step="1" data-id="${item.id}" aria-label="Кількість ${item.name}">
    </div>
  `;
  menuGrid.appendChild(card);
});

// Calculate totals
function calculate(){
  const inputs = document.querySelectorAll('#menu-grid input[type="number"]');
  let total = 0;
  const lines = [];
  inputs.forEach(inp => {
    const qty = Math.max(0, Math.floor(Number(inp.value) || 0));
    const id = inp.dataset.id;
    const menuItem = MENU.find(m => m.id === id);
    if(qty > 0 && menuItem){
      total += qty * menuItem.price;
      lines.push({ name: menuItem.name, qty, price: menuItem.price, subtotal: qty*menuItem.price });
    }
  });

  document.getElementById('total-amount').textContent = formatUAH(total);
  renderReceipt(lines, total);
}

function renderReceipt(lines, total){
  const box = document.getElementById('receipt-section');
  if(lines.length === 0){
    box.innerHTML = '<em>Порожнє замовлення. Додайте позиції з меню.</em>';
    return;
  }
  const name = document.getElementById('customer-name').value.trim();
  let html = '<strong>Підсумок замовлення</strong><br/><br/>';
  html += '<ul>';
  lines.forEach(l => {
    html += `<li>${l.name} — ${l.qty} × ${l.price} грн = ${formatUAH(l.subtotal)} грн</li>`;
  });
  html += '</ul>';
  html += `<div style="margin-top:10px;font-weight:700">Разом: ${formatUAH(total)} грн</div>`;
  if(name) html += `<div style="margin-top:8px">Замовник: ${escapeHtml(name)}</div>`;
  html += '<div style="margin-top:12px;color:#666;font-size:13px">Дякуємо! Це демонстраційна форма — справжня відправка замовлення не відбувається.</div>';
  box.innerHTML = html;
}

// small helper to avoid injection
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]; });
}

// Events
document.getElementById('menu-grid').addEventListener('input', calculate);
document.getElementById('customer-name').addEventListener('input', calculate);
document.getElementById('reset-btn').addEventListener('click', () => {
  document.querySelectorAll('#menu-grid input[type="number"]').forEach(i=>i.value=0);
  document.getElementById('customer-name').value='';
  calculate();
});
document.getElementById('order-btn').addEventListener('click', () => {
  const total = Number(document.getElementById('total-amount').textContent.replace(/\s/g,''));
  if(total <= 0){
    alert('Будь ласка, додайте хоча б одну позицію до замовлення.');
    return;
  }
  // For demo: show alert with summary
  alert('Дякуємо! Ваше замовлення оформлено (демо).\nСума: ' + formatUAH(total) + ' грн');
});

// initial render
calculate();
