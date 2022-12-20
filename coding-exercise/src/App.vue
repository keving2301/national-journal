<script lang="ts">
import {storeToRefs} from "pinia";
import {useSpeciesStore} from "@/stores/speciesStore";
import {ref, watchEffect} from "vue";
import type {Species} from "@/types/Species";
import { defineComponent } from 'vue'

export default defineComponent({

  setup() {
    const {species} = storeToRefs(useSpeciesStore());
    let speciesList = ref<Species[]>();
    useSpeciesStore().fetchFishSpecies().then(() => {
      speciesList.value = species.value;
    })

    const showModal = ref(false);
    const showingSpecie = ref<Species>();
    const preShowModal = (selectedSpecie: Species) => {
      showingSpecie.value = selectedSpecie;
      showModal.value = true;
    }

    const searchInput = ref<string>('')
    watchEffect(() => {
      if(searchInput.value){
        speciesList.value = []
        for(let specie of species.value){
          if(specie["Species Name"].includes(searchInput.value))
            speciesList.value?.push(specie)
        }
      }
      else speciesList.value = species.value

    })

    return {
      speciesList,
      showModal,
      showingSpecie,
      searchInput,
      preShowModal,
    }
  }
})

</script>

<template>
  <div class="navbar">
    <h1 class="unbounded-google-font title">Fish Watch</h1>
    <div class="search-field">
      <input class="h-full search-input" type="search" id="fish-search" name="search" v-model="searchInput">
      <button class="h-full search-btn" type="button">Search</button>
    </div>
  </div>
  <div class="species-list-section">
    <div class="card" v-for="(specie, index) in speciesList" :key="index" @click="preShowModal(specie)">
      <img :src="specie['Species Illustration Photo'].src"
           :alt="specie['Species Illustration Photo'].alt"
           class="w-full species-img">
      <h4>{{ specie['Species Name'] }}</h4>
    </div>
  </div>
  <transition name="fade">
    <div v-if="showModal">
      <div class="overlay" @click.self="showModal = false;">
        <div class="modal">
          <button @click.self="showModal = false;" class="close-icon">x</button>
          <div style="overflow-y: scroll; padding: 0 1.5rem" class="h-full">
            <h1 class="modal-title">{{ showingSpecie['Species Name'] }}</h1>
            <div class="image-gallery">
              <div v-for="image in showingSpecie['Image Gallery']" :key="image.src">
                <img :src="image.src" :alt="image.alt" style="height: 10rem; border-radius: 5px; margin-right: 10px">
              </div>
            </div>
            <div v-for="(value, propertyName) in showingSpecie">
              <div
                  v-if="value && propertyName !== 'Species Illustration Photo' && propertyName !== 'Image Gallery'"
                  class="sections">
                <strong>{{ propertyName }}: </strong>
                <span v-html="value"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.navbar {
  background-color: #A0CFE3;
  display: flex;
  justify-content: space-between;
  padding: 2rem 3rem;
}

.title {
  color: white;
  font-family: 'Unbounded', cursive;
}

.search-field {
  height: 40px;
  border-radius: 20px;
}

.search-input {
  border: none;
  padding: 5px 20px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  width: 20rem;

}

.search-input:focus {
  outline: none;
}

.search-btn {
  background-color: #FAD03A;
  border: none;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 5px 15px;
  cursor: pointer;
}

.species-list-section {
  padding: 5rem 10rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  padding: 1rem;
  height: 17rem;
  width: 15rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  cursor: pointer;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  flex-flow: row wrap;
  align-content: center;
  justify-content: center;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.species-img {
  height: auto;
  max-height: 10rem;
  margin-bottom: 2rem;
}

.modal {
  width: 60vw;
  height: 90vh;
  padding: 1.5rem;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px #e0e0e0;
  font-family: Helvetica, Arial, sans-serif;
  position: relative;
  transition: all .5s ease-in-out; /*make it smooth*/
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 9;
  transition: opacity 0.2s ease;
  background: rgba(0, 0, 0, 0.5);
}

.close-icon {
  position: absolute;
  right: -15px;
  top: -15px;
  font-size: 20px;
  color: #fff;
  z-index: 10;
  background-color: #ff8584;
  border-radius: 15px;
  padding: 2px 8px;
  border: solid 1px #FFFFFF;
  box-shadow: 0 0 10px #838383;
}

.close-icon:hover {
  color: rgba(252, 58, 58, 0.71);
  cursor: pointer;
  transition: 300ms;
}

.modal-title {
  font-family: 'Unbounded', cursive;
  font-size: 20px;
  margin: 20px 0;
}

.image-gallery {
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  overflow-x: auto;
}

.sections {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
}

strong {
  margin-bottom: 10px;
}

/* Popup Animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
