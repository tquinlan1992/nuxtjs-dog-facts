<template>
  <div>
    <div v-if="state.dogFactOrSearch === 'RANDOM_DOG_FACT'">
      <h4>Random Dog Fact</h4>
      <p>{{ state.dogFact }}</p>
    </div>

    <div v-if="state.dogFactOrSearch === 'SEARCH'">
      <h4>Search Results</h4>
      <li v-for="dogFact2 in state.searchResults" :key="dogFact2">
        {{ dogFact2 }}
      </li>
    </div>

    <button @click="loadNewDogFact">Get New Dog Fact</button>

    <form @submit="searchDogFacts">
      <input v-model="state.search" placeholder="search dog fact" />
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import {
  getDogFacts,
  getDogFactsProxy,
  getAllDogFactsProxy,
} from '../data/dog-facts'

enum RandomDogFactOrSearch {
  RANDOM_DOG_FACT = 'RANDOM_DOG_FACT',
  SEARCH = 'SEARCH',
}

export default Vue.extend({
  data(): {
    state: {
      dogFact: string
      search: string
      searchResults: string[]
      dogFactOrSearch: RandomDogFactOrSearch
    }
  } {
    return {
      state: {
        dogFact: '',
        search: '',
        searchResults: [],
        dogFactOrSearch: RandomDogFactOrSearch.RANDOM_DOG_FACT,
      },
    }
  },
  async fetch() {
    const dogFacts = await getDogFacts()
    this.state.dogFact = dogFacts.data[0].fact
  },

  methods: {
    async loadNewDogFact() {
      const dogFacts = await getDogFactsProxy()
      this.state = {
        ...this.state,
        dogFactOrSearch: RandomDogFactOrSearch.RANDOM_DOG_FACT,
        dogFact: dogFacts.data[0].fact,
      }
    },

    async searchDogFacts(event: Event) {
      event.preventDefault()
      const search = this.state.search
      const allDogFacts = await getAllDogFactsProxy()
      const searchWords = search.split(' ')
      const result = allDogFacts.data.reduce<string[]>((result, dogFact) => {
        let containsWord = false
        _.forEach(searchWords, (word) => {
          if (dogFact.fact.includes(word)) {
            containsWord = true
            return false
          }
        })
        if (containsWord) {
          return [...result, dogFact.fact]
        } else {
          return result
        }
      }, [])
      this.state = {
        ...this.state,
        searchResults: result,
        dogFactOrSearch: RandomDogFactOrSearch.SEARCH,
      }
    },
  },
})
</script>
