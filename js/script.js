// https://github.com/amine-lotfi

const wrapper = document.getElementById('wrapper');
const quoteWrapper = document.getElementById('quote-wrapper');

const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');

searchInput.addEventListener("input", (event) => {

    searchMealByName(searchInput.value);

    if (searchInput.value === "") {
        window.location.href = "index.html";
    }

});

async function searchMealByName(input) {

    let APIUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput.value}`;

    try {

        const response = await fetch(APIUrl);
        const data = await response.json();

        if (Array.isArray(data.meals)) {

            wrapper.innerHTML = data.meals.map(meal => `
                    <div class="card me-3 mt-3" style="width: 18rem;">

                        <img src="${meal.strMealThumb}" class="card-img-top img-fluid w-75 pt-2 ms-auto me-auto rounded-circle">

                        <div class="card-body">
                            <h5 class="card-title">${meal.strMeal}</h5>
                            <p class="card-text">Keyword: ${input}</p>
                            <a href="#" class="btn btn-danger" onclick="getDishInfo('${meal.idMeal}')">Details</a>
                        </div>

                    </div>

            `).join("");
        } else {

            wrapper.innerHTML = `
                <h5 class="text-danger text-center"><i class="bi bi-info-circle"></i> No meals found in the data.</h5>
            `;
            console.error("No meals found in the data.");
        }

    } catch (error) {

        console.error("No meals found in the data.");
    }

}

async function getMeals(country) {

    let APIUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`;

    try {

        hideQuoteWrapper();

        const response = await fetch(APIUrl);
        const data = await response.json();

        if (Array.isArray(data.meals)) {

            wrapper.innerHTML = data.meals.map(meal => `
                    <div class="card me-3 mt-3" style="width: 18rem;">

                        <img src="${meal.strMealThumb}" class="card-img-top img-fluid w-75 pt-2 ms-auto me-auto rounded-circle">

                        <div class="card-body">
                            <h5 class="card-title">${meal.strMeal}</h5>
                            <p class="card-text">${country} Dish</p>
                            <a href="#" class="btn btn-danger" onclick="getDishInfo('${meal.idMeal}')">Details</a>
                        </div>

                    </div>

            `).join("");
        } else {

            wrapper.innerHTML = `
                <h5 class="text-danger text-center"><i class="bi bi-info-circle"></i> No meals found in the data.</h5>
            `;
            console.error("No meals found in the data.");
        }

    } catch (error) {

        console.error("Error fetching the data: ", error);

    }

}

function hideQuoteWrapper() {

    quoteWrapper.style.display = "none";

}

function showQuoteWrapper() {

    wrapper.innerHTML = `
    
    <div class="row text-center" id="quote-wrapper">
        <h2 class="fw-bold m-0 p-0">
            ❝ Savor the flavors, embrace the moments, and let every bite tell a delicious story. ❞
        </h3>

        <p class="text-lead text-light fw-bold bg-dark">Enter a meal in the search bar, or pick a country!</p>
    </div>
    
    `;

}

function getDishInfo(dishID) {

    fetchWithDishID(dishID);

}

async function fetchWithDishID(dishID) {

    try {

        const APIUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${dishID}`;

        const response = await fetch(APIUrl);
        const data = await response.json();

        const meals = data.meals;
        const ingredients = [];

        // console.log(data);
        // console.log(ingredients);

        for (let i = 1; i <= 20; i++) {

            // to access the ingredient dynamically
            const ingredient = meals[0][`strIngredient${i}`];
            
            // to check if the ingredient is not empty
            if (ingredient && ingredient.trim() !== "") {

                ingredients.push(ingredient);

            }
        }

        wrapper.innerHTML = `
        
        <div class="col-md-8 m-3">

        <div class="card">

            <img src="${data.meals[0].strMealThumb}" class="card-img-top img-fluid w-75 pt-2 ms-auto me-auto rounded-circle">

            <div class="card-body">
                <h5 class="card-title">${data.meals[0].strMeal}</h5>
                <p class="text-lead">Category: ${data.meals[0].strCategory}</p>
                <p class="text-lead">Origin: ${data.meals[0].strArea}</p>
                <p class="text-lead">Ingredients: ${ingredients.map(ingredient => `${ingredient}`).join(", ")}</p>
                <p class="card-text">Instructions: ${data.meals[0].strInstructions}</p>
                <p class="text-lead"><i class="bi bi-youtube text-danger"></i> <a href="${data.meals[0].strYoutube}" target="_blank">Watch how to make it!</a></p>
                <a href="#" class="btn btn-outline-danger float-end" onclick="gotoHome()">Close</a>
            </div>

        </div>

        `;

    } catch (error) {

        console.error("Error fetching the data: ", error);

    }

}

function gotoHome() {

    showQuoteWrapper();

}