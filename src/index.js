const populateURL = 'http://localhost:3000/quotes?_embed=likes'
const quotesUl = document.querySelector('#quote-list')
const form = document.querySelector("#new-quote-form")

main();

function main(){
    displayQuotesFromDB()
    newQuoteListener()
}

function displayQuotesFromDB(){
    return fetch(populateURL)
    .then( resp => resp.json() )
    .then( jsonDB => {
        jsonDB.forEach( quote => {
            quotesUl.append(makeQuoteLi(quote));
        })
    })
    .catch( err => console.log(err) );
}

function makeQuoteLi(quote){
    const li = document.createElement('li');

    const bq = document.createElement('blockquote');
    bq.classname = 'blockquote';

    const p = document.createElement('p');
    p.className = 'mb-0';
    p.innerHTML = quote.quote;

    const fr = document.createElement('footer');
    fr.className = 'blockquote-footer';
    fr.innerHTML = quote.author;

    const br = document.createElement('br');

    const likeBtn = document.createElement('button');
    likeBtn.className = 'btn-success';
    likeBtn.id = `like${quote.id}`;
    likeBtn.dataset.id = quote.id;

    const likes = quote.likes.length;
    likeBtn.dataset.likes = likes;
    likeBtn.innerHTML = `Likes: ${likes}`;
    likeBtn.addEventListener('click', likeQuote);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-danger';
    deleteBtn.id = `delete${quote.id}`;
    deleteBtn.dataset.id = quote.id;
    deleteBtn.innerHTML = 'Delete';
    deleteBtn.addEventListener('click', deleteQuote);

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.id = `edit${quote.id}`;
    editBtn.dataset.id = quote.id;
    editBtn.innerHTML = 'Edit';
    editBtn.addEventListener('click', editQuote);

    bq.append(p, fr, br, likeBtn, deleteBtn, editBtn);
    li.append(bq);

    return li;
}

function likeQuote(e) {
    const quoteId = parseInt(e.target.dataset.id);
    const reqObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(
            {
                quoteId: parseInt(quoteId),
                createdAt: parseInt(10)       
            }
        )
    }
    fetch(`http://localhost:3000/likes`, reqObj)
    .then((res) => res.json())
    .then(() => {
            const likeBtn = document.getElementById(`like${quoteId}`);
            const likes =  parseInt(likeBtn.dataset.likes) + 1;
            likeBtn.dataset.likes = likes;
            likeBtn.innerHTML = `Likes: ${likes}`;
    })
    .catch( err => console.log(err) );
}

function deleteQuote(e) {
    const quoteId = parseInt(e.target.dataset.id);
    const reqObj = {
        method: 'DELETE'
    }
    fetch(`http://localhost:3000/quotes/${quoteId}`, reqObj)
    .then(resp => resp.json())
    .then(()=>e.target.parentElement.parentElement.remove())
    .catch(err=>console.log(err));
}

function editQuote(e) {
    console.log('edit');
}

function newQuoteListener(){
    form.addEventListener('submit', createNewQuote);
}

function createNewQuote(e){
    e.preventDefault()
    const newQuote = {
        quote: e.target['quote'].value,
        author: e.target['author'].value,
        likes: []
    }
    const reqObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(newQuote)
    }
    fetch('http://localhost:3000/quotes', reqObj)
    .then(resp=>resp.json())
    .then(quote => {
        form.reset();
        quotesUl.append(makeQuoteLi(quote));
    })
}