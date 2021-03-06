const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()
const key = '33c3ad3d272d40fa855ba50cb02be7b5'
const axios = require('axios')
import { apiKey } from '../secrets'

exports.getVeganRecipes = functions.pubsub
    .schedule('0 4 * * 0')
    .onRun(async (context) => {
        // const res = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${key}&tags=vegan,dinner&number=10`)
        // const data = await res.json()
        let newData
        const res = await axios.get(
            `https://api.spoonacular.com/recipes/random?apiKey=${key}&tags=vegan,main%20course,dinner&number=14`
        )
        // const data = await res.json()
        newData = refactorData(res.data)
        // console.log(newData)

        newData = JSON.parse(JSON.stringify(newData))
        db.collection('recipes').doc('vegan').set({ recipe: newData })

        return null
    })

exports.getMeatRecipes = functions.pubsub
    .schedule('0 4 * * 0')
    .onRun(async (context) => {
        let newData
        const res = await axios.get(
            `https://api.spoonacular.com/recipes/random?apiKey=${key}&tags=main%20course,dinner&number=14`
        )

        newData = refactorData(res.data)

        newData = JSON.parse(JSON.stringify(newData))
        db.collection('recipes').doc('meatlover').set({ recipe: newData })

        return null
    })

exports.userDeleted = functions.auth.user().onDelete((user) => {
    const doc = admin.firestore().collection('users').doc(user.uid)
    return doc.delete()
})

const refactorData = (recipesAPI) => {
    const recipesArr = recipesAPI.recipes
    let newArr = []
    for (let i = 0; i < recipesArr.length; i++) {
        let recipe = recipesArr[i]
        const {
            id,
            vegan,
            title,
            extendedIngredients,
            readyInMinutes,
            servings,
            image,
            summary,
            instructions,
            analyzedInstructions,
            spoonacularSourceUrl,
        } = recipe

          if (
              analyzedInstructions.length > 1 ||
              !image ||
              !title.search(/Cake|Whipped Cream/)
          ) {
              continue
          }
        const lastCompleted = ''
        const ingredients = extendedIngredients.map((ingredient) => {
            const { id, name, original, image } = ingredient
            return { id, name, original, image }
        })

        newArr.push({
            id,
            vegan,
            title,
            ingredients,
            readyInMinutes,
            servings,
            image,
            summary,
            instructions,
            analyzedInstructions,
            spoonacularSourceUrl,
            lastCompleted,
        })
    }
    return newArr
}
