document.addEventListener("DOMContentLoaded", displayExp);

let isEditing = false;
let editingExpId = null;

function displayExp() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses.forEach(display);
}

function formSubmit(event) {
  event.preventDefault();

  const amount = event.target.amount.value;
  const description = event.target.description.value;
  const category = event.target.category.value;

  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  if (isEditing) {
    expenses = expenses.map(expense => {
      if (expense.id === editingExpId) {
        return { ...expense, amount, description, category };
      }
      return expense;
    });

    localStorage.setItem('expenses', JSON.stringify(expenses));
    document.getElementById('exp-display').innerHTML = '';
    expenses.forEach(display);

    isEditing = false;
    editingExpId = null;
  } else {
    const newExpense = {
      id: Date.now(),
      amount,
      description,
      category
    };

    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    display(newExpense);
  }

  event.target.reset();
}

function display(expense) {
  const ul = document.getElementById('exp-display');
  const li = document.createElement('li');
  li.textContent = `${expense.amount} - ${expense.description} - ${expense.category} `;

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => editExpense(li, expense.id);
  li.appendChild(editBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => deleteExpense(li, expense.id);
  li.appendChild(deleteBtn);

  ul.appendChild(li);
}

function deleteExpense(li, expID) {
  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses = expenses.filter(expense => expense.id !== expID);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  li.remove();
}

function editExpense(li, expID) {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const expenseToEdit = expenses.find(expense => expense.id === expID);
  if (!expenseToEdit) return;

  document.getElementById('exp-amount').value = expenseToEdit.amount;
  document.getElementById('exp-desc').value = expenseToEdit.description;
  document.getElementById('exp-category').value = expenseToEdit.category;

  li.remove();
  isEditing = true;
  editingExpId = expID;
}
