/* ==========================================================================
   TASKFLOW — script.js
   UI shell is complete. Implement each feature in the sections below.
   ========================================================================== */

/* --------------------------------------------------------------------------
   §0  ELEMENT REFERENCES
   Grab everything you'll need at the top — keeps the rest of the code clean.
   -------------------------------------------------------------------------- */

// Form
const taskTitleInput = document.getElementById('taskTitle');
const taskCategorySelect = document.getElementById('taskCategory');
const addTaskBtn = document.getElementById('addTaskBtn');

// Controls
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
const clearAllBtn = document.getElementById('clearAllBtn');

// Counters
const pendingCountEl = document.getElementById('pendingCount');
const completedCountEl = document.getElementById('completedCount');

// Task list
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');

// Theme
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');

// Propagation demo
const grandparent = document.getElementById('grandparent');
const parent = document.getElementById('parent');
const childBtn = document.getElementById('childBtn');
const togglePropMode = document.getElementById('togglePropMode');
const propModeLabel = document.getElementById('propModeLabel');


/* --------------------------------------------------------------------------
   §1  TASK CREATION MODULE
   ─────────────────────────────────────────────────────────────────────────
   Feature: When "Add" is clicked, create a new task card and append it.

   Steps:
     1. Read the title from taskTitleInput.value (DOM property — live)
     2. Read the category from taskCategorySelect.value
     3. Validate: title must not be empty (trim it first)
     4. Increment taskCounter, call createTaskCard(id, title, category)
     5. Hide #emptyState, append the card to #taskList
     6. Reset the input and select
     7. Call updateCounters()

   DOM methods to use here:
     createElement(), createTextNode(), append() or appendChild()
   -------------------------------------------------------------------------- */

let taskCounter = 0;

function createTaskCard(id, title, category) {
  const card = document.createElement('div');
  card.classList.add('task-card');
  card.setAttribute('data-id', id);
  card.setAttribute('data-status', 'pending');
  card.setAttribute('data-category', category);

  // Status bar (left color strip)
  const bar = document.createElement('div');
  bar.classList.add('task-card__status-bar');

  // Body
  const body = document.createElement('div');
  body.classList.add('task-card__body');

  // Meta row (#id + badge)
  const meta = document.createElement('div');
  meta.classList.add('task-card__meta');

  const idSpan = document.createElement('span');
  idSpan.classList.add('task-card__id', 'mono');
  idSpan.textContent = `#${String(id).padStart(3, '0')}`;

  const badge = document.createElement('span');
  badge.classList.add('badge');
  badge.textContent = category || '—';

  meta.append(idSpan, badge);

  // Title
  const titleEl = document.createElement('p');
  titleEl.classList.add('task-card__title');
  titleEl.textContent = title;

  body.append(meta, titleEl);

  // Actions
  const actions = document.createElement('div');
  actions.classList.add('task-card__actions');

  const editBtn = document.createElement('button');
  const completeBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');

  editBtn.classList.add('btn', 'btn--ghost', 'btn--sm');
  editBtn.setAttribute('data-action', 'edit');
  editBtn.textContent = 'Edit';

  completeBtn.classList.add('btn', 'btn--ghost', 'btn--sm');
  completeBtn.setAttribute('data-action', 'complete');
  completeBtn.textContent = '✓';

  deleteBtn.classList.add('btn', 'btn--ghost', 'btn--sm', 'btn--danger');
  deleteBtn.setAttribute('data-action', 'delete');
  deleteBtn.textContent = '✕';

  actions.append(editBtn, completeBtn, deleteBtn);

  card.append(bar, body, actions);
  return card;
}

addTaskBtn.addEventListener('click', function () {
  if (taskTitleInput.value.trim() === "") return

  taskCounter++

  const card = createTaskCard(taskCounter, taskTitleInput.value, taskCategorySelect.value)
  taskList.append(card)
  emptyState.style.display = "none"

  taskTitleInput.value = ""
  taskCategorySelect.value = ""

  updateCounters()
});


/* --------------------------------------------------------------------------
   §2  ATTRIBUTES vs PROPERTIES
   ─────────────────────────────────────────────────────────────────────────
   Demonstrate the difference. Add this comment block above createTaskCard:

   PROPERTY  → taskTitleInput.value
     Reflects the live DOM state. Updates as the user types.
     This is what you always read for user input.

   ATTRIBUTE → taskTitleInput.getAttribute('value')
     Reflects the initial HTML attribute. Does NOT change when the user types.
     Use setAttribute() to write; removeAttribute() to remove; hasAttribute() to check.

   Proof:
     taskTitleInput.setAttribute('value', 'hello');
     // User types "world" into the input
     taskTitleInput.value;              // → "world"   (property)
     taskTitleInput.getAttribute('value'); // → "hello"  (attribute, unchanged)

   In card creation:
     card.setAttribute('data-id', id);        // write an attribute
     card.getAttribute('data-status');         // read an attribute
     card.dataset.status;                      // same as above via dataset API
     card.setAttribute('data-status', 'complete'); // update it
     card.removeAttribute('data-category');    // remove it (if needed)
     card.hasAttribute('data-id');             // → true
   -------------------------------------------------------------------------- */


/* --------------------------------------------------------------------------
   §3  DOM MANIPULATION — required methods checklist
   ─────────────────────────────────────────────────────────────────────────
   Use all of the following at least once across the project:

   ✅ append()      → taskList.append(card)          [§1 Add Task]
   ✅ prepend()     → taskList.prepend(card)          [alternative: add to top]
   ✅ before()      → existingCard.before(newCard)    [insert before a specific card]
   ✅ after()       → existingCard.after(note)        [insert after a specific card]
   ✅ replaceWith() → card.replaceWith(editForm)      [§4 Edit — swap card with form]
   ✅ remove()      → card.remove()                   [§5 Delete]
   -------------------------------------------------------------------------- */


/* --------------------------------------------------------------------------
   §4  THEME TOGGLE
   ─────────────────────────────────────────────────────────────────────────
   When themeToggle is clicked:
     1. Read current theme from document.documentElement.getAttribute('data-theme')
     2. Toggle: 'dark' → 'light', 'light' → 'dark'
     3. document.documentElement.setAttribute('data-theme', newTheme)
        (CSS custom properties swap automatically — no JS color changes needed)
     4. Update themeLabel.textContent
     5. Optionally: themeToggle.setAttribute('data-theme', newTheme)
        so the button itself also tracks state via dataset

   Methods used: classList, dataset, getAttribute(), setAttribute()
   -------------------------------------------------------------------------- */

themeToggle.addEventListener('click', function () {
  const current = document.documentElement.getAttribute("data-theme")
  const newTheme = current === "dark" ? "light" : "dark"
  document.documentElement.setAttribute("data-theme", newTheme)
  themeLabel.textContent = newTheme === "dark" ? "Light mode" : "Dark mode"
});


/* --------------------------------------------------------------------------
   §5  EVENT HANDLING
   ─────────────────────────────────────────────────────────────────────────
   All addEventListener() calls for the controls:
   -------------------------------------------------------------------------- */

// Search — filter cards as user types
searchInput.addEventListener('input', function () {
  // TODO: filter .task-card elements by matching title text to this.value
});

// Filter by category
filterCategory.addEventListener('change', function () {
  // TODO: show only cards where data-category matches this.value ('' = show all)
  
});

// Clear all tasks
clearAllBtn.addEventListener('click', function () {
  const cards = document.querySelectorAll(".task-card")
  cards.forEach(c => c.remove())
  emptyState.style.display = "initial"
  updateCounters()
});


/* --------------------------------------------------------------------------
   §6  EVENT DELEGATION
   ─────────────────────────────────────────────────────────────────────────
   ONE listener on the parent #taskList handles ALL card button clicks.

   Why:
   - Cards are created dynamically — listeners attached before they exist won't work.
   - N cards × 3 buttons = 3N listeners vs. 1 delegated listener. Much cheaper.

   How it works:
   - Every click inside #taskList bubbles up to this listener.
   - e.target is the element that was actually clicked.
   - e.target.closest('.task-card') walks up to find the card.
   - data-action on the button tells us what to do.
   -------------------------------------------------------------------------- */

taskList.addEventListener('click', function (e) {
  const action = e.target.getAttribute('data-action');
  const card = e.target.closest('.task-card');

  if (!card || !action) return; // click was on the list but not a button

  if (action === 'delete') {
    // TODO:
    // card.remove();
    // updateCounters(); updateEmptyState();
  }

  if (action === 'complete') {
    // TODO:
    // const current = card.getAttribute('data-status');
    // const next = current === 'pending' ? 'complete' : 'pending';
    // card.setAttribute('data-status', next);
    // updateCounters();
  }

  if (action === 'edit') {
    // TODO:
    // Get current title from card, replace card with an inline edit form
    // using card.replaceWith(editForm)
    // On save, build new card and use editForm.replaceWith(newCard)
  }
});


/* --------------------------------------------------------------------------
   §7  EVENT PROPAGATION DEMO
   ─────────────────────────────────────────────────────────────────────────
   BUBBLING  (addEventListener 3rd arg = false, or omit):
     Event fires from the innermost element outward.
     Click child → fires: Child → Parent → Grandparent

   CAPTURING (addEventListener 3rd arg = true):
     Event fires from the outermost element inward.
     Click child → fires: Grandparent → Parent → Child

   stopPropagation() on any handler stops the chain at that point.

   Implementation plan:
     - Keep named handler functions (so you can removeEventListener on them)
     - Store captureMode as a boolean, toggle on #togglePropMode click
     - Re-attach all three listeners with the new capture value each time
   -------------------------------------------------------------------------- */

let captureMode = false;

// Named handler functions (required for removeEventListener to work)
function onGrandparent() { console.log('Grandparent'); }
function onParent() { console.log('Parent'); }
function onChild(e) {
  e.stopPropagation(); // Remove this line to let the event propagate
  console.log('Child');
}

function attachPropListeners(useCapture) {
  // Remove old listeners first
  grandparent.removeEventListener('click', onGrandparent, !useCapture);
  parent.removeEventListener('click', onParent, !useCapture);
  childBtn.removeEventListener('click', onChild, !useCapture);

  // Attach with current capture flag
  grandparent.addEventListener('click', onGrandparent, useCapture);
  parent.addEventListener('click', onParent, useCapture);
  childBtn.addEventListener('click', onChild, useCapture);
}

// TODO: call attachPropListeners(captureMode) on page load

togglePropMode.addEventListener('click', function () {
  // TODO:
  // captureMode = !captureMode;
  // attachPropListeners(captureMode);
  // propModeLabel.textContent = captureMode ? 'Capturing' : 'Bubbling';
});


/* --------------------------------------------------------------------------
   §8  BONUS FEATURES
   ─────────────────────────────────────────────────────────────────────────
   Implement whichever you want. Helpers below.
   -------------------------------------------------------------------------- */

/** Re-counts all tasks by data-status and updates the counter chips. */
function updateCounters() {
  const cards = document.querySelectorAll('.task-card');
  const done = [...cards].filter(c => c.dataset.status === 'complete').length;
  const pending = cards.length - done;
  pendingCountEl.textContent = pending;
  completedCountEl.textContent = done;
}

/** Shows/hides the empty state placeholder based on whether any cards exist. */
function updateEmptyState() {
  // TODO:
  // const hasCards = document.querySelectorAll('.task-card').length > 0;
  // emptyState.style.display = hasCards ? 'none' : '';
}

/*
  DocumentFragment — use when adding multiple tasks at once (e.g., from localStorage):

  const fragment = document.createDocumentFragment();
  tasks.forEach(t => fragment.append(createTaskCard(t.id, t.title, t.category)));
  taskList.append(fragment); // single DOM reflow instead of N reflows

  Local Storage:
  - On add/delete/complete: localStorage.setItem('tasks', JSON.stringify(tasks))
  - On page load:           const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
*/
