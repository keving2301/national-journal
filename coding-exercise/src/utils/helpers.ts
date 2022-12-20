import type {Species} from "@/types/Species";

const orderSpeciesAlphabetically = (species: Species[]): Species[] => {
    return species.sort(function(a,b){
        return a['Species Name'].localeCompare(b['Species Name'])
    })
}

export {orderSpeciesAlphabetically}
