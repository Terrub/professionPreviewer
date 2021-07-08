export class ProfessionSelect {
    availableProfessions = [];
    selectElement = null;

    constructor(professions, element) {
        this.availableProfessions = professions;
        this.selectElement = element;

        this.selectElement.addEventListener('submit', function(event) {
            event.preventDefault();
        });
    }

    buildSelect() {
        for (let profession of this.availableProfessions) {
            let option = document.createElement('option');
            option.setAttribute('value', profession.id);
            option.textContent = profession.name;

            this.selectElement.append(option);
        }
    }

    getSelected() {
        return this.selectElement.value;
    }

    getElement() {
        return this.selectElement;
    }
}