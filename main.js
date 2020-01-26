const COUNTRIES_URL = "https://api.openaq.org/v1/countries"
const LATEST_URL = "https://api.openaq.org/v1/latest"
const CITIES_URL = "https://api.openaq.org/v1/cities"
const Locations_URL = "https://api.openaq.org/v1/locations"

window.onload = () => {
  console.log("JS jest podlaczony");
  rotateDeg = 0;
  const ball = document.getElementById("imgContainer");
  const selectCountry = document.getElementById("selectCountry");
  const selectCity = document.getElementById("selectCity");
  const selectLocations = document.getElementById("selectLocations");
  const testSort = document.getElementById("testSort");
  const button = document.querySelector("button");
  let countryCode = [];
  let citiesArray = [];

  setInterval(() => {
    rotateDeg++;
    ball.style.transform = `rotate(${rotateDeg}deg)`;
    if (rotateDeg >= 360) {
      rotateDeg = 0;
    }
  }, 15);

  fetch(COUNTRIES_URL)
    .then(resp => {
      return resp.json();
    })
    .then( async(result) => {
        countryCode = result.results;
        countryCode.sort(compare);
         createSelect(selectCountry,countryCode,"name","code");
        selectCountry.style.visibility = "visible";        
        // search country cities:
        await connectToAPI(CITIES_URL,selectCountry.value,selectCity,"?country=","city","city")
        // search for locations
        setTimeout(()=>{

            connectToAPI(Locations_URL,selectCity.value,selectLocations,"?city=","location","id")
        },2000);
        

    }
        )
        .catch((err)=>{
            alert("coś poszło nie tak")
        });
        button.addEventListener("click",()=>{
            countryCode.sort(compare);
            createSelect(selectCountry,countryCode);
        })
        testSort.addEventListener("click",()=>
        {
            // let select = document.querySelector("select");
            // alert(select.value);
            connectToAPI(CITIES_URL,selectCountry.value,selectCity,"?country=","city","city");
        });

        selectCountry.onchange= ()=>{
            // alert(selectCountry.value);
            connectToAPI(CITIES_URL,selectCountry.value,selectCity,"?country=","city","city");
            setTimeout(()=>{

                connectToAPI(Locations_URL,selectCity.value,selectLocations,"?city=","location","id")
            },2000);
        }

        selectCity.onchange= ()=>{
            // alert(selectCountry.value);
             connectToAPI(Locations_URL,selectCity.value,selectLocations,"?city=","location","id")
        }
        
    

};
function createSelect(destination,optionArray,keyText,keyAttr,)
{
    destination.innerHTML ="";
    optionArray.forEach((element) => {
        let option = document.createElement("option");
        option.innerText = element[keyText];
        option.setAttribute("value",element[keyAttr]);
        destination.appendChild(option);
    });
    console.log("wartość selecta:",destination.value)
    
}




function compare(a,b)
{
    const bandA = a.name;
    const bandB = b.name;
  
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
}
function filtrArray(arrayCities,countryCode)
{
    let result = arrayCities.filter((element)=>{
        if(countryCode === element.country)
        {
            return element;
        }
    });
    return result;
}

 function connectToAPI(main_URL,key,destination,keyText,optionKeyText,optionKeyAttr)
{
    let endFunction = false;
    console.log()
    let searchURL = main_URL+keyText+key;
    console.log("co chce znaleźć:",searchURL)
    fetch(searchURL).then((resp)=>{
        
        return resp.json();
    })
    .then(result=>{
        citiesArray = result.results;
        console.log("wynik przed dodaniem tabelki",result.results);   
        createSelect(destination,result.results,optionKeyText,optionKeyAttr)
        return  result.results
    })

}

function test123(a){
//alert("Callback 123 = "+a+" litrow");
}
