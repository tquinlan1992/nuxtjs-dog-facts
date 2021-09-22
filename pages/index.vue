<template>
  <div>
    <p>{{ dogFact }}</p>

    <button v-on:click="loadNewDogFact">Get New Dog Fact</button>

    <form v-on:submit="searchDogFacts">
      <input v-model="search" placeholder="search dog fact" />
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

export default Vue.extend({
  data(): { dogFact: string; search: string } {
    return {
      dogFact: '',
      search: '',
    }
  },
  async fetch() {
    const dogFacts = await getDogFacts()
    this.dogFact = dogFacts.data[0].fact
  },

  methods: {
    async loadNewDogFact() {
      const dogFacts = await getDogFactsProxy()
      this.dogFact = dogFacts.data[0].fact
    },

    async searchDogFacts(event: any) {
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
      this.dogFact = result.join('Dog Fact: ')
    },
  },
})
</script>
