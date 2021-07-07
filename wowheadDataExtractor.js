JSON.stringify((function extractRecipeData() {
    console.log("Extracting data from site.");

    function getItemIdAndIdFromLink(link) {
        const itemId = parseInt(link.match('[0-9]+'), 10);
        const id = link.match('\/([^/]+)$')[1];

        return [itemId, id];
    }

    function getIntFromQuerySelector(recipe, selector) {
        let result;
        const element = recipe.querySelector(selector);

        if (element) {
            result = parseInt(element.textContent, 10);
        }

        return result;
    }

    function getReagentsFromRecipe(recipe) {
        const reagents = [];

        const elements = recipe.querySelectorAll('td')[2].querySelectorAll('div.iconmedium');
        for (element of elements) {
            const itemLink = element.querySelector('a').getAttribute('href');
            const [itemId, id] = getItemIdAndIdFromLink(itemLink);
            let quantity = getIntFromQuerySelector(element, 'span span');
            
            if (!quantity) {
                quantity = 1;
            }

            reagents.push(
                {
                    itemId: itemId,
                    id: id,
                    quantity: quantity,
                }
            );
        }

        return reagents;
    }

    const dataSource = [];
    const recipesTable = document.querySelector('table.listview-mode-default');

    if (!recipesTable) {
        console.log("Could not find the source table for recipes, aborting");
        return false;
    }

    const recipes = recipesTable.querySelectorAll('tr.listview-row');

    if (!recipes || recipes.length < 1) {
        console.log("Could not find any recipes, aborting");
        return false
    }

    const numRecipes = recipes.length;
    console.log("Found", numRecipes, "recipes.");
    let recipeNumber = 0;
    for (const recipe of recipes) {
        let message = "Skipping unusable recipe:";

        recipeNumber += 1;

        const itemLink = recipe.querySelectorAll('td div a')[0].getAttribute('href');
        const [itemId, id] = getItemIdAndIdFromLink(itemLink);
        const name = recipe.querySelectorAll('td div a')[1].textContent;
        const quality = recipe.querySelectorAll('td div a')[1].classList[1];
        const usableRecipe = getIntFromQuerySelector(recipe, 'td div.small span');
        
        if (usableRecipe) {
            let orangeLevel = getIntFromQuerySelector(recipe, 'td div.small span.r1');
            if (!orangeLevel) {
                orangeLevel = usableRecipe > 50 ? usableRecipe : 1;
            }
            const yellowLevel = getIntFromQuerySelector(recipe, 'td div.small span.r2');
            const greenLevel = getIntFromQuerySelector(recipe, 'td div.small span.r3');
            const grayLevel = getIntFromQuerySelector(recipe, 'td div.small span.r4');
            const reagents = getReagentsFromRecipe(recipe);

            message = "adding:";

            dataSource.push(
                {
                    itemId: itemId,
                    id: id,
                    name: name,
                    orangeLevel: orangeLevel,
                    yellowLevel: yellowLevel,
                    greenLevel: greenLevel,
                    grayLevel: grayLevel,
                    reagents: reagents,
                    quality: quality,
                }
            );
        }

        console.log(message, name, "(", ((recipeNumber / numRecipes * 100) | 0), "% )");
    }

    console.log("Done extracting.")

    return dataSource;
}()));
