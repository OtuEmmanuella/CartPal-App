import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
  databaseURL:
    "https://mobile-app-database-bb1a4-default-rtdb.europe-west1.firebasedatabase.app/",
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
const inputFieldEl = document.getElementById("input-field")
const addButton = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const toggleBtn = document.getElementById("toggle-btn")
const container = document.querySelector(".container")
const main = document.querySelector(".main")

addButton.addEventListener("click", function () {
  let inputValue = inputFieldEl.value.trim()

  if (inputValue !== "") {
    push(shoppingListInDB, inputValue)
    clearInputFieldEl()
  } else {
    displayInvalidItemMessage()
  }
})

function displayInvalidItemMessage() {
  // Check if the message already exists
  if (!document.getElementById("invalid-item-message")) {
    let message = document.createElement("p")
    message.id = "invalid-item-message"
    message.textContent = "Please enter a valid item."

    shoppingListEl.appendChild(message)
  }
}

onValue(shoppingListInDB, function (snapshot) {
  let itemArray = snapshot.exists() ? Object.entries(snapshot.val()) : []

  clearShoppingListEl()
  removeInvalidItemMessage()

  if (itemArray.length === 0) {
    shoppingListEl.innerHTML = "No Items yet..."
  } else {
    for (let i = 0; i < itemArray.length; i++) {
      let currentItem = itemArray[i]
      let currentItemID = currentItem[0]
      let currentItemValue = currentItem[1]
      appendShoppingListInDB(currentItem)
    }
  }
})

function removeInvalidItemMessage() {
  let message = document.getElementById("invalid-item-message")
  if (message) {
    message.remove()
  }
}

function appendShoppingListInDB(item) {
  let itemID = item[0]
  let itemValue = item[1]

  if (itemValue.trim() !== "") {
    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    newEl.addEventListener("click", function () {
      let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
      remove(exactLocationOfItemInDB)
    })

    shoppingListEl.appendChild(newEl)
  }
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
  inputFieldEl.value = ""
}

toggleBtn.addEventListener("click", () => {
  container.classList.toggle("dark-mode")
  main.classList.toggle("dark-mode")
})
