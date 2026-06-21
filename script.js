const taskTitleInput = document.getElementById('taskTitle')
const taskCategorySelect = document.getElementById('taskCategory')
const addTaskBtn = document.getElementById('addTaskBtn')

const searchInput = document.getElementById('searchInput')
const filterCategory = document.getElementById('filterCategory')
const clearAllBtn = document.getElementById('clearAllBtn')

const pendingCountEl = document.getElementById('pendingCount')
const completedCountEl = document.getElementById('completedCount')

const taskList = document.getElementById('taskList')
const emptyState = document.getElementById('emptyState')

const themeToggle = document.getElementById('themeToggle')
const themeLabel = document.getElementById('themeLabel')

const grandparent = document.getElementById('grandparent')
const parent = document.getElementById('parent')
const childBtn = document.getElementById('childBtn')
const togglePropMode = document.getElementById('togglePropMode')
const propModeLabel = document.getElementById('propModeLabel')


let taskCounter = 0

function createTaskCard(id, title, category) {
  const card = document.createElement('div')
  card.classList.add('task-card')
  card.setAttribute('data-id', id)
  card.setAttribute('data-status', 'pending')
  card.setAttribute('data-category', category)

  const bar = document.createElement('div')
  bar.classList.add('task-card__status-bar')

  const body = document.createElement('div')
  body.classList.add('task-card__body')

  const meta = document.createElement('div')
  meta.classList.add('task-card__meta')

  const idSpan = document.createElement('span')
  idSpan.classList.add('task-card__id', 'mono')
  idSpan.textContent = `#${String(id).padStart(3, '0')}`

  const badge = document.createElement('span')
  badge.classList.add('badge')
  badge.textContent = category || '—'

  meta.append(idSpan, badge)

  const titleEl = document.createElement('p')
  titleEl.classList.add('task-card__title')
  titleEl.textContent = title

  body.append(meta, titleEl)

  const actions = document.createElement('div')
  actions.classList.add('task-card__actions')

  const editBtn = document.createElement('button')
  const completeBtn = document.createElement('button')
  const deleteBtn = document.createElement('button')

  editBtn.classList.add('btn', 'btn--ghost', 'btn--sm')
  editBtn.setAttribute('data-action', 'edit')
  editBtn.textContent = 'Edit'

  completeBtn.classList.add('btn', 'btn--ghost', 'btn--sm')
  completeBtn.setAttribute('data-action', 'complete')
  completeBtn.textContent = '✓'

  deleteBtn.classList.add('btn', 'btn--ghost', 'btn--sm', 'btn--danger')
  deleteBtn.setAttribute('data-action', 'delete')
  deleteBtn.textContent = '✕'

  actions.append(editBtn, completeBtn, deleteBtn)

  card.append(bar, body, actions)
  return card
}

/* --------------------------------------------------------------------------
   §2  ATTRIBUTES vs PROPERTIES
   ─────────────────────────────────────────────────────────────────────────

   PROPERTY  → taskTitleInput.value
     Reflects the live DOM state. Updates as the user types.
     This is what you always read for user input.

   ATTRIBUTE → taskTitleInput.getAttribute('value')
     Reflects the initial HTML attribute. Does NOT change when the user types.
     Use setAttribute() to write; removeAttribute() to remove; hasAttribute() to check.

   Proof:
     taskTitleInput.setAttribute('value', 'hello');
     User types "world" into the input
     taskTitleInput.value;              // → "world"   (property)
     taskTitleInput.getAttribute('value'); // → "hello"  (attribute, unchanged)
     
   -------------------------------------------------------------------------- */

addTaskBtn.addEventListener('click', function () {
  console.log('Property: (input.value):', taskTitleInput.value)
  console.log('Attribute: (getAttribute):', taskTitleInput.getAttribute('value'))

  if (taskTitleInput.value.trim() === '') return

  taskCounter++

  const card = createTaskCard(taskCounter, taskTitleInput.value, taskCategorySelect.value)
  taskList.append(card)

  saveTasks()
  updateEmptyState()

  taskTitleInput.value = ''
  taskCategorySelect.value = ''

  updateCounters()
})

themeToggle.addEventListener('click', function () {
  const current = document.documentElement.getAttribute('data-theme')
  const newTheme = current === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', newTheme)
  themeLabel.textContent = newTheme === 'dark' ? 'Light mode' : 'Dark mode'
})

function applyFilters() {
  const cards = document.querySelectorAll('.task-card')
  const search = searchInput.value.trim().toLowerCase()
  const category = filterCategory.value

  cards.forEach(c => {
    const title = c.querySelector('.task-card__title').textContent.toLowerCase()
    const mathesSearch = title.includes(search)
    const mathesCategory = !category || c.dataset.category === category
    c.style.display = (mathesSearch && mathesCategory) ? '' : 'none'
  })
}

searchInput.addEventListener('input', applyFilters)

filterCategory.addEventListener('change', applyFilters)

clearAllBtn.addEventListener('click', function () {
  const cards = document.querySelectorAll('.task-card')
  cards.forEach(c => c.remove())
  saveTasks()
  updateEmptyState()
  updateCounters()
  searchInput.value = filterCategory.value = ''
})

taskList.addEventListener('click', function (e) {
  const action = e.target.getAttribute('data-action')
  const card = e.target.closest('.task-card')

  if (!card || !action) return

  if (action === 'delete') {
    card.remove()
    saveTasks()
    updateCounters()
    updateEmptyState()
  }

  if (action === 'complete') {
    const current = card.getAttribute('data-status')
    const newStatus = current === 'pending' ? 'complete' : 'pending'
    card.setAttribute('data-status', newStatus)
    saveTasks()
    updateCounters()
  }

  if (action === 'edit') {
    const currentTitle = card.querySelector('.task-card__title').textContent
    const input = document.createElement('input')
    input.className = 'input'
    input.value = currentTitle

    const saveBtn = document.createElement('button')
    saveBtn.className = 'btn btn--primary btn--sm'
    saveBtn.textContent = 'Save'
    saveBtn.setAttribute('data-action', 'save')

    const editRow = document.createElement('div')
    editRow.className = 'task-card'
    editRow.setAttribute('data-id', card.dataset.id)
    editRow.setAttribute('data-status', card.dataset.status)
    editRow.setAttribute('data-category', card.dataset.category)
    editRow.setAttribute('data-editing', 'true')
    editRow.append(input, saveBtn)

    card.replaceWith(editRow)
  }

  if (action === 'save') {
    const newTitle = card.querySelector('.input').value.trim()
    if (!newTitle) return
    const rebuilt = createTaskCard(card.dataset.id, newTitle, card.dataset.category)
    rebuilt.setAttribute('data-status', card.dataset.status)
    card.replaceWith(rebuilt)
    saveTasks()
  }
})

let captureMode = false;

function onGrandparent() { console.log('Grandparent') }
function onParent() { console.log('Parent') }
function onChild() { console.log('Child') }

function attachPropListeners(useCapture) {
  grandparent.removeEventListener('click', onGrandparent, !useCapture)
  parent.removeEventListener('click', onParent, !useCapture)
  childBtn.removeEventListener('click', onChild, !useCapture)

  grandparent.addEventListener('click', onGrandparent, useCapture)
  parent.addEventListener('click', onParent, useCapture)
  childBtn.addEventListener('click', onChild, useCapture)
}

attachPropListeners(captureMode)

togglePropMode.addEventListener('click', function () {
  captureMode = !captureMode
  attachPropListeners(captureMode)
  propModeLabel.textContent = captureMode ? 'Capturing' : 'Bubbling'
})

function updateCounters() {
  const cards = document.querySelectorAll('.task-card')
  const done = [...cards].filter(c => c.dataset.status === 'complete').length
  const pending = cards.length - done
  pendingCountEl.textContent = pending
  completedCountEl.textContent = done
}

function updateEmptyState() {
  const cards = document.querySelectorAll('.task-card')
  emptyState.style.display = cards.length > 0 ? 'none' : ''
}

const STORAGE_KEY = 'taskflow_tasks'

function saveTasks() {
  const cards = document.querySelectorAll('.task-card')
  const tasks = [...cards].map(card => ({
    id: card.dataset.id,
    title: card.querySelector('.task-card__title').textContent,
    category: card.dataset.category,
    status: card.dataset.status
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY)
  const tasks = saved ? JSON.parse(saved) : []

  if (tasks.length === 0) return

  const fragement = document.createDocumentFragment()

  tasks.forEach(t => {
    const card = createTaskCard(t.id, t.title, t.category)
    card.setAttribute('data-status', t.status)
    fragement.append(card)

    const numericId = parseInt(t.id, 10)
    if (numericId > taskCounter) taskCounter = numericId
  })

  taskList.append(fragement)
  updateEmptyState()
  updateCounters()
}

loadTasks()