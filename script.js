const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck= document.querySelector("#lowercase");
const numbersCheck= document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let passwordLength= 10;
let checkCount= 0;
let password = "";
handleSlider();


function handleSlider(){
    inputSlider.value= passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

inputSlider.addEventListener('input', (e)=>{
    passwordLength= e.target.value;
    handleSlider();
})

function handleCheckBox() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBox);
})

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}



copyBtn.addEventListener('click', ()=>{
    if (passwordDisplay.value) {
        copyToClipboard()    
    }
})

function genrateRandInteger(min, max){
    return Math.floor(Math.random()*(max-min)) +min;
}

function genrateRandNumber(){
    return genrateRandInteger(0,9);
}

function genrateRandUppercase(){
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
     
}
function getRandLowercase() {
    let letters = "abcdefghijklmnopqrstuvwxyz";
    return letters[Math.floor(Math.random() * letters.length)];
  }
function getRandSymbol() {
    let symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

    //shadow - HW
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}


generateBtn.addEventListener('click', ()=>{
    if(checkCount==0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
     }
    password= "";

    let funArry =[];

    if(uppercaseCheck.checked){
        funArry.push(genrateRandUppercase)
    }
    if(lowercaseCheck.checked){
        funArry.push(getRandLowercase)
    }
    if(numbersCheck.checked){
        funArry.push(genrateRandNumber)
    }
    if(symbolsCheck.checked){
        funArry.push(getRandSymbol)
    }

    for (let i = 0; i < funArry.length; i++) {
        password += funArry[i]();
    }
  
    for (let i = 0; i < passwordLength - funArry.length; i++) {
        let temp = Math.floor(genrateRandInteger(0,funArry.length))
        password += funArry[temp]();    
    }
 
    //shuffling
    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    //calculate strength
    calcStrength();
    
})