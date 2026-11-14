const response = await fetch("data/index.json");
const index = await response.json();

const definitions = index.items.filter((item)=>item.type === "definition");

document.getElementById("random-button").addEventListener("click", ()=> {
    const pick = definitions[Math.floor(Math.random()*definitions.length)];
    window.location.href=`check.html?id=${pick.id}`;
})