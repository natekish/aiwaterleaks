
let map=L.map("map").setView([38.85,-77.35],9)

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

async function load(){

const res=await fetch("data/wateruse.csv")

const text=await res.text()

const rows=text.trim().split("\n")

const data=rows.slice(1).map(r=>{

const c=r.split(",")

return{

location:c[2],
date:c[3],
gallons:Number(c[4]),
x:Number(c[5]),
y:Number(c[6])

}

})

buildMap(data)

}

function buildMap(data){

const grouped={}

data.forEach(r=>{

if(!grouped[r.location]) grouped[r.location]={lat:r.y,lon:r.x,years:{}}

const y=new Date(r.date).getFullYear()

if(!grouped[r.location].years[y]) grouped[r.location].years[y]=0

grouped[r.location].years[y]+=r.gallons

})

for(const loc in grouped){

const s=grouped[loc]

if(!s.lat || !s.lon) continue

let popup="<b>"+loc+"</b><br><br>"

for(const y in s.years){

popup+=y+": "+s.years[y].toLocaleString()+" gallons<br>"

}

L.marker([s.lat,s.lon]).addTo(map).bindPopup(popup)

}

}

load()
