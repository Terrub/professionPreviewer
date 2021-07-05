import { ProfessionPreviewer } from '../actors/professionPreviewer.js';
import { ropBotTestRunner } from './testRunner.js';

function runTests() {
    ropBotTestRunner(
        'ProfessionPreviewer returns options when provided current crafting level',
        ropBotTestRunner.RESULT_OBJECT_DEEP_COMPARE,
        [{ yellowLevel: 10, orangeLevel: 0 }],
        () => {
            const currentLevel = 9;
            const mockDataProvider = {
                getCraftingRecipes: () => {
                    return [
                        { yellowLevel: 10, orangeLevel: 0 },
                        { yellowLevel: 9, orangeLevel: 0 },
                        { yellowLevel: 20, orangeLevel: 10 },
                    ];
                }
            }
            const profPrev = new ProfessionPreviewer(mockDataProvider);

            return profPrev.getAvailableOptions(currentLevel);
        }
    );

    ropBotTestRunner(
        'ProfessionPreviewer can sort recipes on provided difficulty level',
        ropBotTestRunner.RESULT_OBJECT_DEEP_COMPARE,
        [
            { yellowLevel: 10 },
            { yellowLevel: 15 },
            { yellowLevel: 20 },
            { yellowLevel: 50 },
        ],
        () => {
            const recipes = [
                { yellowLevel: 50 },
                { yellowLevel: 10 },
                { yellowLevel: 20 },
                { yellowLevel: 15 },
            ];

            return ProfessionPreviewer.sortByDifficultyLevel(
                'yellowLevel',
                recipes
            );
        }
    );

    ropBotTestRunner(
        'ProfessionPreviewer.getChanceOfSkillUp returns 0 if current skill below minimum required skill',
        ropBotTestRunner.RESULT_EXACTLY_MATCHES_EXPECTATION,
        0,
        () => {
            const mockRecipe = {
                orangeLevel: 50,
            }
            return ProfessionPreviewer.getChanceOfSkillUp(40, mockRecipe);
        }
    );

    ropBotTestRunner(
        'ProfessionPreviewer.getChanceOfSkillUp returns 0.8 if current skill above yellow, below gray',
        ropBotTestRunner.RESULT_EXACTLY_MATCHES_EXPECTATION,
        0.8, // (gray - currentLevel) / (gray - yellow)
        () => {
            const mockRecipe = {
                orangeLevel: 30,
                yellowLevel: 35,
                greenLevel: 55,
                grayLevel: 60,
            }
            return ProfessionPreviewer.getChanceOfSkillUp(40, mockRecipe);
        }
    );

    ropBotTestRunner(
        'ProfessionPreviewer.getChanceOfSkillUp returns 1 if current skill below yellow and above orange',
        ropBotTestRunner.RESULT_EXACTLY_MATCHES_EXPECTATION,
        1,
        () => {
            const mockRecipe = {
                orangeLevel: 30,
                yellowLevel: 45,
                greenLevel: 60,
                grayLevel: 80,
            };

            return ProfessionPreviewer.getChanceOfSkillUp(40, mockRecipe);
        }
    );
}

runTests();