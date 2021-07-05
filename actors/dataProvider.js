import { JCDataProvider } from "../connectors/jcDataProvider";

const dataSets = {
    jewelCrafting: JCDataProvider.craftingRecipes,
};

export class DataProvider {
    data = [];

    constructor() {
        for (const dataType in dataSets) {
            for (const item of dataSets[dataType]) {
                item.type = dataType;
                this.data.push(item);
            }
        }
    }

    getRecipes(type) {
        return this.data.filter((item) => {
            return item.type === type;
        });
    }
}