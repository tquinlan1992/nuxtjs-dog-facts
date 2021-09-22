<template>
  <div>
    <button @click="loadNewDogFact">Get New Dog Fact</button>

    <form @submit="searchDogFacts">
      <input v-model="search" placeholder="search dog fact" />
    </form>

    <div v-if="dogFactOrSearch === 'RANDOM_DOG_FACT'">
      <h4>Random Dog Fact</h4>
      <p style="white-space: pre-line">{{ dogFact }}</p>
    </div>

    <div v-if="dogFactOrSearch === 'SEARCH'">
      <h4>Search Results</h4>
      <li v-for="dogFact2 in searchResults" :key="dogFact2">
        {{ dogFact2 }}
      </li>
    </div>
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
    dogFact: string
    search: string
    searchResults: string[]
    dogFactOrSearch: RandomDogFactOrSearch
  } {
    return {
      dogFact: '',
      search: '',
      searchResults: [],
      dogFactOrSearch: RandomDogFactOrSearch.RANDOM_DOG_FACT,
    }
  },
  async fetch() {
    const dogFacts = await getDogFacts()
    this.dogFact = 'Server Generated Dog fact: \n' + dogFacts.data[0].fact
  },

  methods: {
    async loadNewDogFact() {
      const dogFacts = await getDogFactsProxy()
      this.dogFactOrSearch = RandomDogFactOrSearch.RANDOM_DOG_FACT
      this.dogFact = dogFacts.data[0].fact
    },

    async searchDogFacts(event: Event) {
      event.preventDefault()
      const search = this.search
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
      this.searchResults = result
      this.dogFactOrSearch = RandomDogFactOrSearch.SEARCH
    },
  },
})
</script>
