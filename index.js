import { menuArray } from "./data.js";

let totalPrice = 0

document.addEventListener('click', function(e) {
    if (e.target.dataset.add) {
        addItem(e.target.dataset.add)
    } else if (e.target.dataset.remove) {
        removeItem(e.target.dataset.remove)
    }
    else if (e.target.id === "submit-order") {
        displayPayModal()
    } else if (!e.target.closest(".pay")) {
        closePayModal()
    } else if (e.target.id === "pay-btn") {
        e.preventDefault()
        displayMessage()
    }
})

function getMenuItems() {
    let menuItems = ''

    menuArray.forEach(function(item){
        menuItems += `<section>
        <div id="${item.id}" class="menu-item"><p class="emoji">${item.emoji}</p><div class="item-details"><h2>${item.name}</h2><p>${item.ingredients}</p><h3>$${item.price}</h3></div><div class="item-action"><i data-add="${item.id}" class="fa-sharp fa-solid fa-plus"></i></div><span data-count="${item.id}" class="item-amount"></span></div>
        </section>`
    })

    render(menuItems)
}

function addItem(itemId) {
    const itemListing = document.getElementById(`${itemId}`)
    const targetItemObj = menuArray.filter(function(item){
       return item.id === parseInt(itemId)
    })[0]

    if (targetItemObj.ordering === 0){
        targetItemObj.ordering++
        document.querySelector(`[data-count="${itemId}"]`).style.display = "inline"
        totalPrice += targetItemObj.price
        displayOrder(totalPrice)
        itemListing.innerHTML += `<div class="remove-item"><i data-remove="${itemId}" class="fa-sharp fa-solid fa-minus"></i></div>`
    } else if (targetItemObj.ordering > 0) {
        targetItemObj.ordering++
        totalPrice += targetItemObj.price
        displayOrder(totalPrice)
    }

    document.querySelector(`[data-count="${itemId}"]`).innerHTML = `${targetItemObj.ordering}`

}

function removeItem(itemId) {
    const removeItem = document.querySelector(`[data-remove="${itemId}"]`);
    const targetItemObj = menuArray.filter(function(item){
        return item.id === parseInt(itemId)
     })[0]
 
     if (targetItemObj.ordering > 1){
        targetItemObj.ordering--
        totalPrice -= targetItemObj.price
        displayOrder(totalPrice)
     } else if (targetItemObj.ordering === 1) {
        targetItemObj.ordering = 0
        document.querySelector(`[data-count="${itemId}"]`).style.display = "none"
        totalPrice -= targetItemObj.price
        displayOrder(totalPrice)
        removeItem.remove()
     }

     if (targetItemObj.ordering > 0) {
        document.querySelector(`[data-count="${itemId}"]`).innerHTML = `${targetItemObj.ordering}`
     }
}


function displayOrder(totalPrice) {
    let order = ''
    let orderDetails = ''

    order = `<section>
        <div id="order-details"></div>
        <div class="total-price"><h2>Total price:</h2><div class="item-price"><h3>$${totalPrice}</h3></div></div>
        <button id="submit-order">Complete order</button>
        </section>`

    orderDetails += `<h1>Your order</h1>`
    
    menuArray.forEach(function(item) {

        let itemTotal = item.price * item.ordering

        if(item.ordering > 0) {
            orderDetails += `<div class="order-item"><h2>${item.name} x ${item.ordering}</h2><div class="item-price"><h3>$${itemTotal}</h3></div></div>`
        }
    })

    document.getElementById("order").innerHTML = order
    document.getElementById("order-details").innerHTML = orderDetails
}

function displayPayModal() {
    if (totalPrice > 0) {
        document.getElementById("pay").style.display = 'inline';
    }
}

function closePayModal() {
    document.getElementById("pay").style.display = 'none';
}

function displayMessage() {
    let name = document.getElementById("name").value
    let cardNumber = document.getElementById("card-number").value
    let cvv = document.getElementById("cvv").value
    if(name && cardNumber && cvv) {
        document.getElementById("pay").style.display = 'none';
    document.getElementById("order").innerHTML = `<div class="payment-complete"><h2>Thanks, ${name}! Your order is on it's way!</h2></div>`
    }
}

function render(menuItems) {

    document.getElementById("menu-items").innerHTML = menuItems

    menuArray.forEach(function(item) {
        if (menuArray.indexOf(item) === menuArray.length - 1) {
            document.getElementById(`${item.id}`).style.border = "none"
        }
    })
}

getMenuItems()