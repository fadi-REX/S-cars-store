const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "cgyovbo32wuu",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "EQ5xn38dT6O2hAuUZzjgTvX7CjYlb8L2pgYGqgBXrM4"
});



// varriables

const cartbtn = document.querySelector('.cart-btn');
const closecartbtn = document.querySelector('.close-cart');
const clearcartbtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartoverlay = document.querySelector('.cart-overlay');
const cartitems = document.querySelector('.cart-items');
const carttotal = document.querySelector('.cart-total');
const cartcontent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
const shopbtn = document.querySelector(".banner-btn")

// cart
let cart = []

// buttons
let buttonsDOM = []


// getting products
class Products{
    async getproducts(){
      try {
        const entry = await client.getEntries({
          content_type: "sCars"
        })
        

        // let result = await fetch('products.json')
        // let data   = await  result.json()

        let products = entry.items
        products = products.map(item =>{
            const {title,price} = item.fields;
            const  {id} = item.sys
            const  image = item.fields.image.fields.file.url
            return {title,price,id,image}
        })
        return products
     
      } catch (error) {
        console.log(error)
      }
          
    }

 
}

// display products
class UI{
displayproducts(products){
let result=''
products.forEach( product => {
  result += `
   <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img src="${product.image}" alt="image of product" class="product-img">
                    <button class="bag-btn" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                        Add to cart
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}K</h4>
            </article>
            <!-- end of single product  -->
  
  `  
})
productsDOM.innerHTML = result
}

getbagbuttons(){

    const buttons = [...document.querySelectorAll('.bag-btn')]
    buttonsDOM = buttons
    buttons.forEach(button => {
        let id = button.dataset.id
        let incart = cart.find(item => item.id == id)
        if (incart){
            button.innerText = "In Cart"
            button.disabled = true
            
        }
        {
        button.addEventListener("click",(event)=>{
          event.target.textContent = 'In Cart'
          event.target.disabled = true
          //   get product from products
          let cartitem = {...storage.getproduct(id), amount : 1}
          //   add product to the cart
              cart = [...cart,cartitem]
          //   save cart in local storage
              storage.savecart(cart)
          //   set cart values 
              this.setcartvalues(cart)
          //   display cart item
              this.addcartitem(cartitem)
          //   show the cart
              this.showcart()
          })
         
        }
        
    })
    
}

setcartvalues(cart) {
   let temptotal = 0
   let itemstotal = 0

   cart.map(item =>{
     temptotal += item.price * item.amount
     itemstotal += item.amount
   })

   carttotal.innerText = temptotal
   cartitems.innerText = itemstotal

}

addcartitem(cartitem){

 cartcontent.innerHTML += `
                <div class="cart-item">
                    <img src="${cartitem.image}" alt="product">
                    <div>
                        <h4>${cartitem.title}</h4>
                        <h5>$${cartitem.price}k</h5>
                        <span class="remove-item" data-id="${cartitem.id}">remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id="${cartitem.id}"></i>
                        <p class="item-amount">${cartitem.amount}</p>
                        <i class="fas fa-chevron-down" data-id="${cartitem.id}"></i>
                    </div>
                </div>`


}



showcart(){

   cartoverlay.classList.add('transparentBcg')
   cartDOM.classList.add('showCart')

}

hidecart(){
   cartoverlay.classList.remove('transparentBcg')
   cartDOM.classList.remove('showCart')
  
}

setapp(){
 
 cart = storage.getcart()
 this.setcartvalues(cart)
 this.populatecart(cart)
 cartbtn.addEventListener('click',(event)=> {
  this.showcart()
 })
 closecartbtn.addEventListener("click", (event)=>{

  this.hidecart()
 })
}




populatecart(cart){
  cart.forEach(item => { 

       this.addcartitem(item)

  })


}


cartlogic() {
    // clear  cart button
   clearcartbtn.addEventListener('click',()=> {

    this.clearcart()
   })
    // clear cart function
    cartcontent.addEventListener('click',(event) => {
       if(event.target.classList.contains('remove-item')){
        
        this.removeitem(event.target.dataset.id)
        event.target.parentElement.parentElement.remove()
        
        
       }
       else if(event.target.classList.contains('fa-chevron-up')){
        let tempitem = cart.find(item => item.id == event.target.dataset.id)
            tempitem.amount = tempitem.amount + 1
            storage.savecart(cart)
            this.setcartvalues(cart)
            event.target.nextElementSibling.innerText = tempitem.amount
            
       }
       else if(event.target.classList.contains('fa-chevron-down')){
        let tempitem = cart.find(item => item.id == event.target.dataset.id)
         if (tempitem.amount > 1){
            tempitem.amount = tempitem.amount - 1
            storage.savecart(cart)
            this.setcartvalues(cart)
            event.target.previousElementSibling.innerText = tempitem.amount
            }
       }


    })
  
}

clearcart(){
   let cartitems = cart.map(item => item.id)
   cartitems.forEach(id => this.removeitem(id))
   cartcontent.innerHTML = ""
   this.hidecart()
}


removeitem(id){
   cart = cart.filter(item => item.id !== id)
   this.setcartvalues(cart)
   storage.savecart(cart)
    let button = this.getsinglebutton(id)
    button.disabled = false
    button.innerHTML = `
    <i class="fas fa-shopping-cart"></i>
                        Add to cart
    `
}


getsinglebutton(id){
   return buttonsDOM.find(button => button.dataset.id === id)

}


shoppingbtn(){
    
   shopbtn.addEventListener("click",()=>{

       window.scrollBy(0,700)
   })
  


}
}

// local storage 
class storage{
    static saveproducts(products){
       localStorage.setItem("products",JSON.stringify(products))

    }

    static getproduct(id){
      let products = JSON.parse(localStorage.getItem("products"))

      return products.find(product => product.id === id)

    }

    static savecart(cart){
      localStorage.setItem('cart',JSON.stringify(cart))
    }

    static getcart(){
      return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[]
    }
}



document.addEventListener("DOMContentLoaded",function(){
const ui= new UI()
const products = new Products()

// setup app

ui.setapp()


// get all products
products.getproducts().then(products => {
ui.displayproducts(products)
storage.saveproducts(products)

}).then(() => {
    ui.getbagbuttons()
    ui.cartlogic()
    ui.shoppingbtn()



})







})



 
 