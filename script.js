let entries = JSON.parse(localStorage.getItem('entries')) || [];
let filter = 'all';

window.onload = () => {
  renderEntries();
  updateSummary();
  setupEventListeners();
};

function setupEventListeners() {
  document.getElementById('addEntryButton').addEventListener('click', addEntry);
  document.getElementById('resetButton').addEventListener('click', resetForm);
  document.querySelectorAll('input[name="filter"]').forEach(filterInput => {
    filterInput.addEventListener('change', applyFilter);
  });
}

// Add an entry
function addEntry() {
  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.querySelector('input[name="type"]:checked').value;

  if (!description || isNaN(amount) || amount <= 0) {
    alert('Please provide valid inputs.');
    return;
  }

  const entry = { id: Date.now(), description, amount, type };
  entries.push(entry);
  saveEntries();
  renderEntries();
  updateSummary();
  resetForm();
}

// Reset the form
function resetForm() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.querySelector('input[name="type"][value="income"]').checked = true;
}

// Save entries to local storage
function saveEntries() {
  localStorage.setItem('entries', JSON.stringify(entries));
}

// Render entries in a table
function renderEntries() {
  const tableBody = document.querySelector('#entryTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  const filteredEntries = entries.filter(entry => filter === 'all' || entry.type === filter);
  filteredEntries.forEach(entry => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${entry.description}</td>
      <td>Rs. ${entry.amount.toFixed(2)}</td>
      <td>${entry.type}</td>
      <td>
        <button onclick="editEntry(${entry.id})">Edit</button>
        <button onclick="deleteEntry(${entry.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Update summary values
function updateSummary() {
  const totalIncome = entries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpense = entries.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);
  const netBalance = totalIncome - totalExpense;

  document.getElementById('totalIncome').innerText = `Rs. ${totalIncome.toFixed(2)}`;
  document.getElementById('totalExpense').innerText = `Rs. ${totalExpense.toFixed(2)}`;
  document.getElementById('netBalance').innerText = `Rs. ${netBalance.toFixed(2)}`;
}

// Apply filter
function applyFilter() {
  filter = document.querySelector('input[name="filter"]:checked').value;
  renderEntries();
}

// Delete an entry
function deleteEntry(id) {
  entries = entries.filter(entry => entry.id !== id);
  saveEntries();
  renderEntries();
  updateSummary();
}

// Edit an entry
function editEntry(id) {
  const entry = entries.find(entry => entry.id === id);
  if (!entry) return;

  document.getElementById('description').value = entry.description;
  document.getElementById('amount').value = entry.amount;
  document.querySelector(`input[name="type"][value="${entry.type}"]`).checked = true;

  deleteEntry(id);
}
