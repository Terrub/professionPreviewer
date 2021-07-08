import { DataProvider } from "./actors/dataProvider.js";
import { RecipeTable } from "./ui/recipeTable.js";
import { ProfessionSelect } from "./ui/professionSelect.js";
import { ProfessionPreviewer } from "./actors/professionPreviewer.js";

const dataProvider = new DataProvider();
const profPreview = new ProfessionPreviewer(dataProvider, DataProvider.TYPE_JEWELCRAFTING);
const recipes = new RecipeTable(profPreview);
const professionSelector = new ProfessionSelect([
    {
        id: DataProvider.TYPE_JEWELCRAFTING,
        name: 'Jewelcrafting',
    },
    {
        id: DataProvider.TYPE_TAILORING,
        name: 'Tailoring',
    },
    {
        id: DataProvider.TYPE_BLACKSMITHING,
        name: 'Blacksmithing',
    },

    {
        id: DataProvider.TYPE_LEATHERWORKING,
        name: 'Leatherworking',
    },
], document.getElementById('profession'));

document.getElementById('level').addEventListener('change', (event) => {
    recipes.buildTable(event.target.value);
});

document.getElementById('toggle_inventory').addEventListener('click', () => {
    const inventory = document.getElementById('inventory');
    inventory.classList.toggle('d-none');
    inventory.classList.toggle('d-block');
});

document.getElementById('levelForm').addEventListener('submit', (event) => {
    event.preventDefault();
});

document.getElementById('professionForm').addEventListener('submit', (event) => {
    event.preventDefault();
});

professionSelector.getElement().addEventListener('change', () => {
    profPreview.setProfession(professionSelector.getSelected());
    document.getElementById('level').value = 1;
    recipes.buildTable(1);
});

recipes.buildTable(1);
professionSelector.buildSelect();