export class ProfessionPreviewer {
    dataProvider = null;

    profession = null;

    constructor(dataProvider, profession) {
        this.dataProvider = dataProvider;
        this.profession = profession;
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

    static sortBySkillChance(level, recipes) {
        recipes.sort((first, second) => {
            const chanceA = ProfessionPreviewer.getChanceOfSkillUp(level, first);
            const chanceB = ProfessionPreviewer.getChanceOfSkillUp(level, second);

            return chanceB - chanceA;
        });

        return recipes;
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
        const craftingRecipes = this.dataProvider.getRecipes(this.profession);
        const availableOptions = ProfessionPreviewer.filterRecipesByLevel(pLevel, craftingRecipes);

        ProfessionPreviewer.sortBySkillChance(pLevel, availableOptions);

        return availableOptions;
    }

    setProfession(profession) {
        this.profession = profession;
    }
}
