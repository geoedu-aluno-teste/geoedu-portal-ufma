# GeoEdu Portal UFMA

**Plataforma Acadêmica de Geotecnologias** para apoio ao ensino de Geoprocessamento, Sensoriamento Remoto e Análise Espacial.

## Protótipo v1.0

O MVP utiliza Leaflet, HTML, CSS e JavaScript e foi estruturado para hospedagem estática no GitHub Pages.

### Funcionalidades
- visualização cartográfica interativa;
- mapas-base OpenStreetMap e CARTO;
- ativação/desativação de camadas;
- GeoJSON demonstrativo;
- consulta de atributos por popup;
- coordenadas do cursor;
- escala cartográfica;
- medição simples de distância;
- interface responsiva;
- espaço reservado para futura integração GeoAI/OpenAI.

## Estrutura
`index.html` — interface principal  
`css/style.css` — identidade visual  
`js/map.js` — mapa, camadas e ferramentas  
`data/geojson/` — dados vetoriais GeoJSON

## Roadmap
1. Inserção de dados geoespaciais reais e validados.
2. Fluxo QGIS → GeoJSON → GeoEdu Portal.
3. Serviços WMS/WMTS/XYZ e catálogo de dados.
4. Supabase/PostgreSQL/PostGIS.
5. GeoAI/OpenAI através de backend seguro.

## Segurança
Chaves privadas de APIs não devem ser armazenadas em JavaScript público.
