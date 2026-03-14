
let allRecords=[]
let records=[]
let chart

async function loadCSV(){

const res = await fetch("data/wateruse.csv")
const text = await res.text()
const rows = text.trim().split("\n")

allRecords = rows.slice(1).map(r=>{
const c=r.split(",")
return{
company:c[0],
utility:c[1],
location:c[2],
date:c[3],
year:new Date(c[3]).getFullYear(),
gallons:Number(c[4]),
x:Number(c[5]),
y:Number(c[6])
}
})

records=[...allRecords]

buildUtilityTable()
loadLocations()
}

function buildUtilityTable(){

const totals={}

records.forEach(r=>{
if(!totals[r.utility]) totals[r.utility]={}
if(!totals[r.utility][r.year]) totals[r.utility][r.year]=0
totals[r.utility][r.year]+=r.gallons
})

const tbody=document.querySelector("#utilityTable tbody")
tbody.innerHTML=""

for(const u in totals){
for(const y in totals[u]){
let tr=document.createElement("tr")
tr.innerHTML=`<td>${u}</td><td>${y}</td><td>${totals[u][y].toLocaleString()}</td>`
tbody.appendChild(tr)
}
}
}

function loadLocations(){

const sidebar=document.getElementById("locations")
const locs=[...new Set(records.map(r=>r.location))]

locs.forEach(loc=>{
let btn=document.createElement("button")
btn.className="locationBtn"
btn.innerText=loc
btn.onclick=()=>drawChart(loc)
sidebar.appendChild(btn)
})
}

function drawChart(loc){

const data=records.filter(r=>r.location===loc)
const labels=data.map(d=>d.date)
const vals=data.map(d=>d.gallons)

if(chart) chart.destroy()

chart=new Chart(
document.getElementById("siteChart"),
{
type:"line",
data:{labels:labels,datasets:[{label:loc,data:vals}]},
options:{maintainAspectRatio:false}
}
)
}

function downloadCSV(){
window.location="data/wateruse.csv"
}

loadCSV()
