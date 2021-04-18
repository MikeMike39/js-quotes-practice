const quoteUL = document.getElementById("quote-list")
const quoteForm = document.getElementById("new-quote-form")
fetch("http://localhost:3000/quotes?_embed=likes")
.then(r => r.json())
.then(quoteObjArr => {
    quoteObjArr.forEach(quoteObj => {
      turnJsonToHtml(quoteObj)        
    });
})

quoteForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    let newQuote = evt.target["new-quote"].value
    
    let newAuthor = evt.target.author.value
    console.log(newAuthor)
    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"

        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor
        })
    })
    .then(r => r.json())
    .then((newQuote) => {
        newQuote.likes = []
        turnJsonToHtml(newQuote)
    }
        )
})


function turnJsonToHtml(quote){
    let quoteLi = document.createElement("li")
        quoteLi.className = "quote-card"
    quoteLi.innerHTML = `<blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
  </blockquote>`
      quoteUL.append(quoteLi)
    let deleteBtn = quoteLi.querySelector(".btn-danger")
    let likesBtn = quoteLi.querySelector(".btn-success")
    let likesSpan = quoteLi.querySelector("span")
    
    deleteBtn.addEventListener("click", () => {
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: "DELETE"
        })
        .then(r => r.json())
        .then(
            quoteLi.remove()
        )
    })


    likesBtn.addEventListener("click", () => {
        console.log("hello")
        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({
                quoteId: quote.id
            })
        })
        .then(r => r.json())
        .then( newLikes => {
           quote.likes.push(newLikes)
           likesSpan.innerText = quote.likes.length


        }
        )
    })

}