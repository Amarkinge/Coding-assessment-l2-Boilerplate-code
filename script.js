console.log('====================================');
console.log("Connected");
console.log('====================================');
const baseUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json';
let productData = '';
var units = document.getElementById('counter');
const thumbnails = document.querySelectorAll('.tmbnl');


const fetchProductData = function () {
    let response = fetch(new URL(baseUrl));
    // Handle promise rejection using .catch method
    response.then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else return response.text();
    }).catch((error) => console.log('Error:' + error))
        .then((data) => {
            productData = JSON.parse(data);
            displayProductInfo()
        });
};

// Displaying the Product Information on HTML page
function displayProductInfo() {
    document.getElementById('vendor').innerHTML = productData.product.vendor;
    document.getElementById('title').innerHTML = productData.product.title;
    document.getElementById('price').innerHTML = productData.product.price;
    let discount = ((Number(productData.product.compare_at_price.slice(1)) - Number(productData.product.price.slice(1))) / Number(productData.product.compare_at_price.slice(1))) * 100;
    document.getElementById('discount').innerHTML = discount.toFixed(0) + '% OFF';
    var mainPrice = document.getElementById('mainPrice');
    mainPrice.innerHTML = productData.product.compare_at_price.toString();
    mainPrice.style.textDecoration = "line-through";
    let options = productData.product.options;
    document.getElementById('options').appendChild(displayOptionsList(options));
    document.getElementById('counter').innerText = Number(localStorage.getItem('quantity')) || 1;
    document.getElementById('description').innerHTML = productData.product.description;
}


function displayOptionsList(options) {
    let optionsDiv = document.createElement('div');
    optionsDiv.setAttribute('id', 'options-list');
    for (var i = 0; i < options.length; i++) {

        if (options[i].name.toLowerCase() === 'color' || Number(options[i].position) == 1) {
            let colorOptionsHeading = document.createElement('h5');
            colorOptionsHeading.textContent = 'Choose a Color';
            colorOptionsHeading.className = 'color-heading';
            optionsDiv.appendChild(colorOptionsHeading);
            optionsDiv.appendChild(createColorOptionsList(options, i));
        }

        if (options[i].name.toLowerCase() == 'size' || Number(options[i].position) == 2) {
            let sizeOptionsHeading = document.createElement('h5');
            sizeOptionsHeading.textContent = 'Choose a Size';
            sizeOptionsHeading.className = "size-heading"
            let line3 = document.createElement('hr');
            line3.id = 'line3';
            optionsDiv.appendChild(line3);
            optionsDiv.appendChild(sizeOptionsHeading);
            optionsDiv.appendChild(createSizeOptionsList(options, i));
        }
    }
    return optionsDiv;
}

function createColorOptionsList(options, index) {
    var list = document.createElement('ul');
    list.className = 'color-list'
    var listItem = options[index].values;


    var selectedColor = localStorage.getItem("selectedColor") == null ||  localStorage.getItem("selectedColor") == undefined ? 'Yellow' : localStorage.getItem("selectedColor");

    const activeColor = document.querySelector('.color-active');
    if (activeColor != null) {
        activeColor.removeChild(activeColor.firstChild);
        localStorage.removeItem('selectedColor');
        activeColor.classList.remove('color-active');
    }

    listItem.forEach(element => {
        var li = document.createElement('li');
        const key = Object.keys(element)[0];
        const value = element[key];
        li.style.backgroundColor = value;
        li.setAttribute('class', 'color ' + key);
        li.setAttribute('id', 'color');
        if (key.toLowerCase() === selectedColor.toLowerCase()) {
            li.classList.add('color-active');
            let spanElement = document.createElement('span');
            spanElement.className = "checkmark";
            spanElement.textContent = '\u2713';
            li.appendChild(spanElement);
        }
        li.onclick = (e) => onColorClick(e);
        // li.style.width = "50px";
        // li.style.height = "50px";
        li.style.display = "block";
        list.appendChild(li);
    });
    return list;
}

function createSizeOptionsList(options, index) {
    var div = document.createElement('div');
    div.setAttribute("class", "sizes");
    let selectedSize = localStorage.getItem("selectedSize") == null? 'Small' : localStorage.getItem("selectedSize") ;
    var array = options[index].values;
    array.forEach(element => {
        var div2 = document.createElement('div');
        div2.className = 'radio-label'
        var radioInput = document.createElement('input');
        radioInput.setAttribute('value', element);
        radioInput.setAttribute('name', 'size');
        radioInput.setAttribute('class', 'radio-button');
        radioInput.setAttribute('id', element.toLowerCase().trim().replace(' ', '-'));
        radioInput.type = "radio";
        var label = document.createElement('label');
        label.setAttribute('for', element.toLowerCase().trim().replace(' ', '-'));
        label.id = element.toLowerCase().trim().replace(' ', '-');
        label.className = element.toLowerCase();
        label.textContent = element;
        label.onclick = (e) => onSizeClick(e);
        if (label.textContent.toLowerCase() == selectedSize.toLowerCase())
            radioInput.checked = true;
        div2.appendChild(radioInput);
        div2.appendChild(label);
        div.appendChild(div2);
    });
    return div;
}

document.querySelector('#rect12').addEventListener('click', () => {
    const messageElement = document.getElementById('message');
    let selectedColor = localStorage.getItem('selectedColor');
    let selectedSize = localStorage.getItem('selectedSize');
    messageElement.textContent = `Embrace Sideboard with Color ${selectedColor} and Size ${selectedSize} added to cart`;
    messageElement.style.display = 'flex';

});

document.getElementById('decrement').addEventListener('click', (e) => {
    e.preventDefault();
    if (Number(units.innerText) > 1) {
        units.innerText = Number(units.innerText) - 1;
        localStorage.setItem('quantity', units.innerText);
    }

});

document.getElementById('increment').addEventListener('click', (e) => {
    e.preventDefault();
    if (Number(units.innerText) >= 1) {
        units.innerText = Number(units.innerText) + 1;
        localStorage.setItem('quantity', units.innerText);
    }
});


thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', (event) => {
        event.preventDefault();
        changeMainImage(event);
    });
});

function changeMainImage(event) {
    let element = event.target;
    let img = document.getElementById('mainImage');
    img.src = element.getAttribute("src");
}




function onColorClick(e) {
    e.preventDefault();
    let element = e.target;
    const activeColor = document.querySelector('.color-active');
    if (activeColor != null) {
        activeColor.removeChild(activeColor.firstChild);
        localStorage.removeItem('selectedColor');
        activeColor.classList.remove('color-active');
    }
    element.classList.add('color-active');
    let currentSelectedColor = element.classList[1];
    localStorage.setItem('selectedColor', currentSelectedColor);
    let spanElement = document.createElement('span');
    spanElement.className = "checkmark";
    spanElement.textContent = '\u2713';
    element.appendChild(spanElement);

}


function onSizeClick(event) {
    localStorage.removeItem('selectedSize');
    let element = event.target;
    const selectedSize = element.textContent;
    localStorage.setItem("selectedSize", selectedSize);
}

fetchProductData();