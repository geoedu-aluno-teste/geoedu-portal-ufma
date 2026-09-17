const fallbackView={center:[-5.1,-45.2],zoom:6};
const map=L.map('map',{zoomControl:true}).setView(fallbackView.center,fallbackView.zoom);

const basemaps={
  osm:L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}),
  light:L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:20,attribution:'&copy; OpenStreetMap contributors &copy; CARTO'})
};
let currentBasemap=basemaps.osm.addTo(map);
L.control.scale({imperial:false,position:'bottomleft'}).addTo(map);

let municipios=null;
let maranhaoBounds=null;
const municipiosCheckbox=document.getElementById('layer-municipios');

function formatArea(value){
  const n=Number(value);
  return Number.isFinite(n)?n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}):'—';
}

function municipioPopup(props){
  return `<div class="municipio-popup"><strong>${props.NM_MUN||'Município'}</strong><br>`+
    `Código IBGE: ${props.CD_MUN||'—'}<br>`+
    `UF: ${props.SIGLA_UF||'MA'}<br>`+
    `Área: ${formatArea(props.AREA_KM2)} km²<br>`+
    `<small>Fonte: IBGE — Malha Municipal 2025</small></div>`;
}

fetch('data/geojson/municipios_ma_2025_web.geojson')
  .then(response=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json();})
  .then(data=>{
    municipios=L.geoJSON(data,{
      style:{color:'#185d55',weight:1,fillColor:'#6eb8ad',fillOpacity:.18},
      onEachFeature:(feature,layer)=>{
        layer.bindPopup(municipioPopup(feature.properties||{}));
        layer.on({
          mouseover:e=>e.target.setStyle({weight:2,fillOpacity:.32}),
          mouseout:e=>municipios.resetStyle(e.target)
        });
      }
    });
    if(municipiosCheckbox.checked)municipios.addTo(map);
    maranhaoBounds=municipios.getBounds();
    if(maranhaoBounds.isValid())map.fitBounds(maranhaoBounds,{padding:[15,15]});
  })
  .catch(error=>{
    console.error('Erro ao carregar municípios:',error);
    municipiosCheckbox.checked=false;
    municipiosCheckbox.disabled=true;
    const label=municipiosCheckbox.parentElement;
    label.append(' — erro ao carregar');
  });

const campus=L.circleMarker([-2.558,-44.308],{radius:8,color:'#123f3b',weight:2,fillOpacity:.75})
  .bindPopup('<b>Ponto demonstrativo</b><br>Camada temporária a ser substituída por unidades acadêmicas validadas.').addTo(map);

document.querySelectorAll('input[name="basemap"]').forEach(r=>r.addEventListener('change',e=>{
  map.removeLayer(currentBasemap);currentBasemap=basemaps[e.target.value].addTo(map);currentBasemap.bringToBack();
}));

municipiosCheckbox.addEventListener('change',e=>{
  if(!municipios)return;
  e.target.checked?municipios.addTo(map):map.removeLayer(municipios);
});
document.getElementById('layer-campus').addEventListener('change',e=>e.target.checked?campus.addTo(map):map.removeLayer(campus));
document.getElementById('btn-home').onclick=()=>maranhaoBounds&&maranhaoBounds.isValid()?map.fitBounds(maranhaoBounds,{padding:[15,15]}):map.setView(fallbackView.center,fallbackView.zoom);

map.on('mousemove',e=>document.getElementById('coords').textContent=`Lat: ${e.latlng.lat.toFixed(5)} | Long: ${e.latlng.lng.toFixed(5)}`);

let measuring=false,points=[],measureLine=null,labels=[];
function distance(a,b){const R=6371,rad=x=>x*Math.PI/180,dLat=rad(b.lat-a.lat),dLon=rad(b.lng-a.lng),s=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(s));}
function clearMeasure(){points=[];if(measureLine){map.removeLayer(measureLine);measureLine=null;}labels.forEach(x=>map.removeLayer(x));labels=[];}
document.getElementById('btn-measure').onclick=()=>{measuring=!measuring;document.getElementById('btn-measure').textContent=measuring?'■ Finalizar medição':'↔ Medir distância';};
document.getElementById('btn-clear').onclick=clearMeasure;
map.on('click',e=>{if(!measuring)return;points.push(e.latlng);if(measureLine)map.removeLayer(measureLine);measureLine=L.polyline(points,{color:'#123f3b',weight:3,dashArray:'7,6'}).addTo(map);if(points.length>1){let total=0;for(let i=1;i<points.length;i++)total+=distance(points[i-1],points[i]);labels.push(L.tooltip({permanent:true,direction:'top',className:'measure-label'}).setLatLng(e.latlng).setContent(`${total.toFixed(2)} km`).addTo(map));}});

const modal=document.getElementById('modal');
document.getElementById('btn-geoai').onclick=()=>modal.hidden=false;
document.getElementById('modal-close').onclick=()=>modal.hidden=true;
modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true;});
document.getElementById('menu-toggle').onclick=()=>document.getElementById('sidebar').classList.toggle('open');