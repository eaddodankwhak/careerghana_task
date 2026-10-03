const levelNames = { 1: "Beginner", 2: "Home cook", 3: "Chef" };
const ingredientForm = document.querySelector("#ingredient-form");
const ingredientInput = document.querySelector("#ingredient-input");
const ingredientChips = document.querySelector("#ingredient-chips");
const textSearch = document.querySelector("#text-search");
const levelFilter = document.querySelector("#level-filter");
const dietFilter = document.querySelector("#diet-filter");
const timeFilter = document.querySelector("#time-filter");
const kindFilter = document.querySelector("#kind-filter");
const savedOnly = document.querySelector("#saved-only");
const mealButtons = [...document.querySelectorAll(".meal-button")];
const recipeGrid = document.querySelector("#recipe-grid");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const recipeDialog = document.querySelector("#recipe-dialog");
const dialogContent = document.querySelector("#dialog-content");
const savedRecipes = loadSavedRecipes();
const activeIngredients = new Set();
let selectedMeal = "all";

function loadSavedRecipes() {
  try {
    const saved = JSON.parse(localStorage.getItem("pantry-pick-saved") || "[]");
    return new Set(Array.isArray(saved) ? saved.filter((id) => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

function saveSavedRecipes() {
  try {
    localStorage.setItem("pantry-pick-saved", JSON.stringify([...savedRecipes]));
  } catch {
    resultCount.textContent = "Saved for this visit only; browser storage is unavailable.";
  }
}

function normalize(value) {
  return value.trim().toLocaleLowerCase();
}

function canonicalizeIngredient(value) {
  return normalize(value)
    .replace(/\b([a-z]+)ies\b/g, "$1y")
    .replace(/\b([a-z]+)oes\b/g, "$1o")
    .replace(/\b([a-z]+)es\b/g, "$1")
    .replace(/\b([a-z]+[^s])s\b/g, "$1");
}

function hasIngredient(ingredient) {
  const target = canonicalizeIngredient(ingredient);
  const ingredientWords = target.split(/\s+/);
  return [...activeIngredients].some((available) => {
    const availableIngredient = canonicalizeIngredient(available);
    return availableIngredient === target || ingredientWords.includes(availableIngredient);
  });
}

function addIngredient(value) {
  const ingredient = normalize(value);
  if (!ingredient || [...activeIngredients].some((item) => canonicalizeIngredient(item) === canonicalizeIngredient(ingredient))) return;
  activeIngredients.add(ingredient);
  renderIngredients();
  renderRecipes();
}

function removeIngredient(ingredient) {
  activeIngredients.delete(ingredient);
  renderIngredients();
  renderRecipes();
}

function renderIngredients() {
  ingredientChips.replaceChildren();
  for (const ingredient of activeIngredients) {
    const chip = document.createElement("span");
    chip.className = "ingredient-chip";
    const label = document.createElement("span");
    label.textContent = ingredient;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", `Remove ${ingredient}`);
    removeButton.addEventListener("click", () => removeIngredient(ingredient));
    chip.append(label, removeButton);
    ingredientChips.append(chip);
  }
}

function recipeMatchesIngredients(recipe) {
  return recipe.ingredients.filter(hasIngredient).length;
}

function matchesSearch(recipe, query) {
  if (!query) return true;
  const searchable = [recipe.name, recipe.region, ...recipe.ingredients].join(" ").toLocaleLowerCase();
  return searchable.includes(query);
}

function getVisibleRecipes() {
  const query = normalize(textSearch.value);
  const maxTime = timeFilter.value === "all" ? Infinity : Number(timeFilter.value);
  return window.PANTRY_RECIPES
    .map((recipe) => ({ recipe, matches: recipeMatchesIngredients(recipe) }))
    .filter(({ recipe, matches }) => {
      const ingredientsMatch = activeIngredients.size === 0 || matches > 0;
      const levelMatch = levelFilter.value === "all" || recipe.level === Number(levelFilter.value);
      const dietMatch = dietFilter.value === "all" || recipe.diet.includes(dietFilter.value);
      const mealMatch = selectedMeal === "all" || recipe.meals.includes(selectedMeal);
      const kindMatch = kindFilter.value === "all" || recipe.kind === kindFilter.value;
      const savedMatch = !savedOnly.checked || savedRecipes.has(recipe.id);
      return ingredientsMatch && levelMatch && dietMatch && mealMatch && kindMatch && recipe.time < maxTime && savedMatch && matchesSearch(recipe, query);
    })
    .sort((first, second) => second.matches - first.matches || first.recipe.time - second.recipe.time);
}

function makeDietTags(diets) {
  const list = document.createElement("div");
  list.className = "diet-list";
  diets.forEach((diet) => {
    const tag = document.createElement("span");
    tag.className = "diet-tag";
    tag.textContent = diet === "gluten-free" ? "Gluten-free" : diet[0].toUpperCase() + diet.slice(1);
    list.append(tag);
  });
  return list;
}

function createRecipeCard(recipe, matches) {
  const card = document.createElement("article");
  card.className = "recipe-card";

  const openButton = document.createElement("button");
  openButton.type = "button";
  openButton.className = "card-open";
  openButton.setAttribute("aria-label", `View ${recipe.name} recipe`);
  openButton.addEventListener("click", () => openRecipe(recipe));

  const art = document.createElement("div");
  art.className = "card-art";
  const emoji = document.createElement("span");
  emoji.className = "card-emoji";
  emoji.setAttribute("aria-hidden", "true");
  emoji.textContent = recipe.emoji;

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "card-save";
  saveButton.textContent = savedRecipes.has(recipe.id) ? "★" : "☆";
  saveButton.setAttribute("aria-label", `${savedRecipes.has(recipe.id) ? "Remove" : "Save"} ${recipe.name} ${savedRecipes.has(recipe.id) ? "from" : "to"} saved recipes`);
  saveButton.setAttribute("aria-pressed", String(savedRecipes.has(recipe.id)));
  saveButton.addEventListener("click", () => toggleSaved(recipe.id));
  art.append(emoji, saveButton);

  const body = document.createElement("div");
  body.className = "card-body";
  const meta = document.createElement("div");
  meta.className = "card-meta";
  const cuisine = document.createElement("span");
  cuisine.textContent = recipe.region;
  const time = document.createElement("span");
  time.textContent = `${recipe.time} min`;
  meta.append(cuisine, time);

  const title = document.createElement("h3");
  title.textContent = recipe.name;
  const detail = document.createElement("div");
  detail.className = "card-detail-row";
  const level = document.createElement("span");
  level.textContent = levelNames[recipe.level];
  const matchCount = document.createElement("span");
  matchCount.className = "match-count";
  matchCount.textContent = `You have ${matches} of ${recipe.ingredients.length} ingredients`;
  detail.append(level, matchCount);
  body.append(meta, title, makeDietTags(recipe.diet), detail);
  openButton.append(body);
  card.append(art, openButton);
  return card;
}

function renderRecipes() {
  const recipes = getVisibleRecipes();
  recipeGrid.replaceChildren(...recipes.map(({ recipe, matches }) => createRecipeCard(recipe, matches)));
  const count = recipes.length;
  const mealLabel = selectedMeal === "all" ? "all meals" : selectedMeal;
  resultCount.textContent = `${count} ${count === 1 ? "recipe" : "recipes"} for ${mealLabel}`;
  emptyState.hidden = count !== 0;
  recipeGrid.hidden = count === 0;
}

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function openRecipe(recipe) {
  dialogContent.replaceChildren();
  const heading = document.createElement("div");
  heading.className = "dialog-heading";
  appendTextElement(heading, "span", "dialog-emoji", recipe.emoji).setAttribute("aria-hidden", "true");
  appendTextElement(heading, "h2", "", recipe.name).id = "dialog-title";
  dialogContent.append(heading);

  const meta = document.createElement("div");
  meta.className = "dialog-meta";
  appendTextElement(meta, "span", "", recipe.region);
  appendTextElement(meta, "span", "", `${recipe.time} min`);
  appendTextElement(meta, "span", "", levelNames[recipe.level]);
  appendTextElement(meta, "span", "", recipe.kind === "drink" ? "Drink" : "Food");
  dialogContent.append(meta, makeDietTags(recipe.diet));

  const ingredientsSection = document.createElement("section");
  ingredientsSection.className = "dialog-section";
  appendTextElement(ingredientsSection, "h3", "", "Ingredients");
  const ingredientList = document.createElement("ul");
  ingredientList.className = "ingredient-list";
  recipe.ingredients.forEach((ingredient) => {
    const item = document.createElement("li");
    const check = document.createElement("span");
    const isAvailable = hasIngredient(ingredient);
    check.className = `ingredient-check${isAvailable ? " is-have" : ""}`;
    check.textContent = isAvailable ? "✓" : "";
    check.setAttribute("aria-hidden", "true");
    item.append(check, document.createTextNode(ingredient));
    ingredientList.append(item);
  });
  ingredientsSection.append(ingredientList);

  const methodSection = document.createElement("section");
  methodSection.className = "dialog-section";
  appendTextElement(methodSection, "h3", "", "Method");
  const methodList = document.createElement("ol");
  methodList.className = "method-list";
  recipe.steps.forEach((step) => appendTextElement(methodList, "li", "", step));
  methodSection.append(methodList);

  const actions = document.createElement("div");
  actions.className = "dialog-actions";
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "primary-button";
  saveButton.textContent = savedRecipes.has(recipe.id) ? "Remove from saved" : "Save recipe";
  saveButton.addEventListener("click", () => {
    toggleSaved(recipe.id);
    saveButton.textContent = savedRecipes.has(recipe.id) ? "Remove from saved" : "Save recipe";
  });
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "secondary-button";
  closeButton.textContent = "Done";
  closeButton.addEventListener("click", () => recipeDialog.close());
  actions.append(saveButton, closeButton);
  dialogContent.append(ingredientsSection, methodSection, actions);

  recipeDialog.showModal();
}

function toggleSaved(recipeId) {
  if (savedRecipes.has(recipeId)) savedRecipes.delete(recipeId);
  else savedRecipes.add(recipeId);
  saveSavedRecipes();
  renderRecipes();
}

function clearFilters() {
  textSearch.value = "";
  levelFilter.value = "all";
  dietFilter.value = "all";
  timeFilter.value = "all";
  kindFilter.value = "all";
  savedOnly.checked = false;
  selectedMeal = "all";
  mealButtons.forEach((button) => {
    const isSelected = button.dataset.meal === selectedMeal;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  activeIngredients.clear();
  renderIngredients();
  renderRecipes();
}

ingredientForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addIngredient(ingredientInput.value);
  ingredientInput.value = "";
  ingredientInput.focus();
});

[textSearch, levelFilter, dietFilter, timeFilter, kindFilter, savedOnly].forEach((control) => {
  control.addEventListener("input", renderRecipes);
  control.addEventListener("change", renderRecipes);
});
mealButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedMeal = button.dataset.meal;
    mealButtons.forEach((mealButton) => {
      const isSelected = mealButton === button;
      mealButton.classList.toggle("is-selected", isSelected);
      mealButton.setAttribute("aria-pressed", String(isSelected));
    });
    renderRecipes();
  });
});
document.querySelector("#clear-filters").addEventListener("click", clearFilters);
document.querySelector("#empty-clear").addEventListener("click", clearFilters);
document.querySelector("#dialog-close").addEventListener("click", () => recipeDialog.close());
recipeDialog.addEventListener("click", (event) => {
  if (event.target === recipeDialog) recipeDialog.close();
});

renderRecipes();