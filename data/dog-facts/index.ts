import axios from 'axios'

export const getDogFacts = () =>
  axios.get<{ fact: string }[]>(
    'http://dog-facts-api.herokuapp.com/api/v1/resources/dogs?number=1'
  )

export const getDogFactsProxy = () =>
  axios.get<{ fact: string }[]>('/dog-facts/api/v1/resources/dogs?number=1')

export const getAllDogFactsProxy = () =>
  axios.get<{ fact: string }[]>('/dog-facts/api/v1/resources/dogs/all')
