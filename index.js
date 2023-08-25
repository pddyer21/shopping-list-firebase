import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-86684-default-rtdb.firebaseio.com/"
}


const app = initializeApp(appSettings) 
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const addBtn = document.getElementById("add-button")
const inputEl = document.getElementById("input-field")
const shoppingListEl = document.getElementById("shopping-list")

addBtn.addEventListener("click", function() {
    let inputValue = inputEl.value

    if (inputValue === "") {
        alert("The item field must be filled out...")
    } else {
        push(shoppingListInDB, inputValue)
        clearInputFieldEl() 
    }   
})

onValue(shoppingListInDB, function(snapshot) {

    if (snapshot.exists()) {

        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
    
        for (let i = 0; i < itemsArray.length; i++) {
    
            let currentItem = itemsArray[i]
            let currentItemID  = currentItem[0]
            let currentItemValue = currentItem[1]
    
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here...yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputEl.value = ""
}

function appendItemToShoppingListEl(item) {
    //shoppingListEl.innerHTML += `<li>${item}</li>`
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    newEl.addEventListener("click", function() {
        let exactItemLocationInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactItemLocationInDB)
    })

    shoppingListEl.append(newEl)
}