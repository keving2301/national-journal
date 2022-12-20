import {defineStore} from 'pinia'
import type {Species} from "@/types/Species";
import {orderSpeciesAlphabetically} from "@/utils/helpers";

export const useSpeciesStore = defineStore('species', {
    state: () => {
        return {
            species: [] as Species[],
        }
    },
    actions: {
        async fetchFishSpecies() {
            try {
                let response = await fetch("https://www.fishwatch.gov/api/species");
                let data = await response.json();
                this.species = orderSpeciesAlphabetically(data)
                console.log(this.species)
            } catch (error) {
                console.log(error);
            }
        }
    },
})
