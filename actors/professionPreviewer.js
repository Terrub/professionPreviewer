export class ProfessionPreviewer {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
    }

    static filterRecipesByLevel(pLevel, pCraftingRecipes) {
        const craftingRecipes = pCraftingRecipes.filter((recipe) => {
            return (pLevel >= recipe.orangeLevel);
        })

        return craftingRecipes;
    }

    static sortRecipesByDifficultyLevel(difficulty, craftingRecipes) {
        craftingRecipes.sort((first, second) => {
            return first[difficulty] - second[difficulty];
        });

        return craftingRecipes;
    }

    static getChanceOfSkillUp(currentLevel, recipe) {        
        if (currentLevel < recipe.orangeLevel) {
            return 0;
        }        
        
        const yellow = recipe.yellowLevel;
        if (currentLevel > yellow) {
            const gray = recipe.grayLevel;
            return (gray - currentLevel) / (gray - yellow)
        }

        return 1;
    }

    getAvailableOptions(pLevel) {
        const craftingRecipes = this.dataProvider.getData();
        const availableOptions = ProfessionPreviewer.filterByLevel(
            pLevel,
            craftingRecipes
        );

        ProfessionPreviewer.sortByDifficultyLevel(
            'yellowLevel',
            availableOptions
        );

        return availableOptions;
    }
}