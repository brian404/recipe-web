document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn');
  const mealContainer = document.getElementById('meal');
  const detailsContainer = document.getElementById('meal-details');
  const closeBtn = document.getElementById('recipe-close-btn');

  searchBtn.addEventListener('click', () => {
    const searchInput = document.getElementById('search-input').value;

    if (searchInput.trim()) {
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`)
        .then(response => response.json())
        .then(data => {
          displayMeals(data.meals);
        });
    } else {
      // Show random recipes if no input is provided
      fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
          displayMeals(data.meals);
        });
    }
  });

  function displayMeals(meals) {
    if (!meals) {
      mealContainer.innerHTML = '<p class="notFound">No meals found. Please try again.</p>';
      return;
    }

    mealContainer.innerHTML = meals
      .map(
        meal => `
        <div class="meal-item" data-id="${meal.idMeal}">
          <div class="meal-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          </div>
          <div class="meal-name">
            <h3>${meal.strMeal}</h3>
          </div>
          <button class="recipe-btn">Get Recipe</button>
        </div>
      `
      )
      .join('');

    const recipeBtns = document.querySelectorAll('.recipe-btn');
    recipeBtns.forEach(btn => {
      btn.addEventListener('click', showRecipe);
    });
  }

  function showRecipe() {
    const mealId = this.parentElement.getAttribute('data-id');
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then(response => response.json())
      .then(data => {
        displayMealDetails(data.meals[0]);
      });
  }

  function displayMealDetails(meal) {
    detailsContainer.innerHTML = `
      <button class="close-btn" id="recipe-close-btn">&times;</button>
      <div class="details-content">
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <p class="recipe-instruct">${meal.strInstructions}</p>
        <div class="recipe-meal-img">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-link">
          <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>
        </div>
      </div>
    `;

    detailsContainer.style.display = 'block';

    closeBtn.addEventListener('click', () => {
      detailsContainer.style.display = 'none';
    });
  }
});
