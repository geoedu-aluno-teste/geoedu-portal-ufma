const fallbackView={center:[-5.1,-45.2],zoom:6};
const map=L.map('map',{zoomControl:true}).setView(fallbackView.center,fallbackView.zoom);

const basemaps={
  osm:L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}),
  light:L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:20,attribution:'&copy; OpenStreetMap contributors &copy; CARTO'})
};
let currentBasemap=basemaps.osm.addTo(map);
L.control.scale({imperial:false,position:'bottomleft'}).addTo(map);

let maranhao=null,municipios=null,maranhaoBounds=null;
const maranhaoCheckbox=document.getElementById('layer-maranhao');
const municipiosCheckbox=document.getElementById('layer-municipios');

function formatArea(value){const n=Number(value);return Number.isFinite(n)?n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}):'—';}
function municipioPopup(p){return `<div class="municipio-popup"><strong>${p.NM_MUN||'Município'}</strong><br>Código IBGE: ${p.CD_MUN||'—'}<br>UF: ${p.SIGLA_UF||'MA'}<br>Área: ${formatArea(p.AREA_KM2)} km²<br><small>Fonte: IBGE — Malha Municipal 2025</small></div>`;}
function estadoPopup(p){return `<div class="municipio-popup"><strong>${p.NM_UF||'Maranhão'}</strong><br>Código da UF: ${p.CD_UF||'—'}<br>Sigla: ${p.SIGLA_UF||'MA'}<br>Região: ${p.NM_REGIAO||'Nordeste'}<br>Área: ${formatArea(p.AREA_KM2)} km²<br><small>Fonte: IBGE — Malha Territorial 2025</small></div>`;}

fetch('data/geojson/maranhao_limite_2025_web.geojson')
.then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();})
.then(data=>{
  maranhao=L.geoJSON(data,{
    style:{color:'#123f3b',weight:3,opacity:.95,fillColor:'#6eb8ad',fillOpacity:.04},
    onEachFeature:(f,l)=>l.bindPopup(estadoPopup(f.properties||{}))
  });
  if(maranhaoCheckbox.checked)maranhao.addTo(map);
  maranhaoBounds=maranhao.getBounds();
  if(maranhaoBounds.isValid())map.fitBounds(maranhaoBounds,{padding:[15,15]});
})
.catch(error=>{console.error('Erro ao carregar limite estadual:',error);maranhaoCheckbox.checked=false;maranhaoCheckbox.disabled=true;maranhaoCheckbox.parentElement.append(' — erro ao carregar');});

fetch('data/geojson/municipios_ma_2025_web.geojson')
.then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();})
.then(data=>{
  municipios=L.geoJSON(data,{
    style:{color:'#397c73',weight:.8,fillColor:'#6eb8ad',fillOpacity:.16},
    onEachFeature:(f,l)=>{
      l.bindPopup(municipioPopup(f.properties||{}));
      l.on({mouseover:e=>e.target.setStyle({weight:2,fillOpacity:.30}),mouseout:e=>municipios.resetStyle(e.target)});
    }
  });
  if(municipiosCheckbox.checked)municipios.addTo(map);
  if(!maranhaoBounds){maranhaoBounds=municipios.getBounds();if(maranhaoBounds.isValid())map.fitBounds(maranhaoBounds,{padding:[15,15]});}
  if(maranhao&&map.hasLayer(maranhao))maranhao.bringToFront();
})
.catch(error=>{console.error('Erro ao carregar municípios:',error);municipiosCheckbox.checked=false;municipiosCheckbox.disabled=true;municipiosCheckbox.parentElement.append(' — erro ao carregar');});

const campus=L.circleMarker([-2.558,-44.308],{radius:8,color:'#123f3b',weight:2,fillOpacity:.75}).bindPopup('<b>Ponto demonstrativo</b><br>Camada temporária a ser substituída por unidades acadêmicas validadas.').addTo(map);

document.querySelectorAll('input[name="basemap"]').forEach(r=>r.addEventListener('change',e=>{map.removeLayer(currentBasemap);currentBasemap=basemaps[e.target.value].addTo(map);currentBasemap.bringToBack();}));
maranhaoCheckbox.addEventListener('change',e=>{if(!maranhao)return;e.target.checked?maranhao.addTo(map):map.removeLayer(maranhao);if(e.target.checked)maranhao.bringToFront();});
municipiosCheckbox.addEventListener('change',e=>{if(!municipios)return;e.target.checked?municipios.addTo(map):map.removeLayer(municipios);if(maranhao&&map.hasLayer(maranhao))maranhao.bringToFront();});
document.getElementById('layer-campus').addEventListener('change',e=>e.target.checked?campus.addTo(map):map.removeLayer(campus));
document.getElementById('btn-home').onclick=()=>maranhaoBounds&&maranhaoBounds.isValid()?map.fitBounds(maranhaoBounds,{padding:[15,15]}):map.setView(fallbackView.center,fallbackView.zoom);
map.on('mousemove',e=>document.getElementById('coords').textContent=`Lat: ${e.latlng.lat.toFixed(5)} | Long: ${e.latlng.lng.toFixed(5)}`);

let measuring=false,points=[],measureLine=null,labels=[];
function distance(a,b){const R=6371,rad=x=>x*Math.PI/180,dLat=rad(b.lat-a.lat),dLon=rad(b.lng-a.lng),s=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(s));}
function clearMeasure(){points=[];if(measureLine){map.removeLayer(measureLine);measureLine=null;}labels.forEach(x=>map.removeLayer(x));labels=[];}
document.getElementById('btn-measure').onclick=()=>{measuring=!measuring;document.getElementById('btn-measure').textContent=measuring?'■ Finalizar medição':'↔ Medir distância';};
document.getElementById('btn-clear').onclick=clearMeasure;
map.on('click',e=>{if(!measuring)return;points.push(e.latlng);if(measureLine)map.removeLayer(measureLine);measureLine=L.polyline(points,{color:'#123f3b',weight:3,dashArray:'7,6'}).addTo(map);if(points.length>1){let total=0;for(let i=1;i<points.length;i++)total+=distance(points[i-1],points[i]);labels.push(L.tooltip({permanent:true,direction:'top',className:'measure-label'}).setLatLng(e.latlng).setContent(`${total.toFixed(2)} km`).addTo(map));}});

const modal=document.getElementById('modal');document.getElementById('btn-geoai').onclick=()=>modal.hidden=false;document.getElementById('modal-close').onclick=()=>modal.hidden=true;modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true;});document.getElementById('menu-toggle').onclick=()=>document.getElementById('sidebar').classList.toggle('open');