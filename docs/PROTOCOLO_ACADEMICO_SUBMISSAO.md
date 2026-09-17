# GeoEdu Portal UFMA — Protocolo Acadêmico de Submissão

## 1. Finalidade
Este protocolo estabelece o fluxo acadêmico para preparação, teste, submissão, revisão e publicação de produtos geoespaciais desenvolvidos nas disciplinas de Geoprocessamento e Sensoriamento Remoto.

## 2. Níveis de participação
- **Professor/GEOPRO:** mantém a versão oficial, revisa as submissões e decide sobre sua incorporação ao Geoportal.
- **Grupos de alunos:** produzem e documentam os dados, trabalham em forks e submetem Pull Requests.
- **Usuários:** acessam e utilizam a versão publicada do GeoEdu Portal UFMA.

## 3. Fluxo obrigatório
**Fonte de dados → QGIS/processamento → controle de qualidade → preparação WebGIS → Laboratório GeoEdu → Fork → Upload → Commit → Pull Request → revisão → publicação.**

O teste no Laboratório não publica nem envia o arquivo ao GitHub.

## 4. Organização por disciplina
### Geoprocessamento
Pasta de submissão: `data/geoprocessamento/projetos_alunos/`

Padrão: `GEO_AAAA_grupoNN_tema.geojson`

Exemplo: `GEO_2026_grupo03_rodovias_ma.geojson`

### Sensoriamento Remoto
Pasta de submissão: `data/sensoriamento_remoto/projetos_alunos/`

Padrão: `SR_AAAA_grupoNN_tema.ext`

Exemplo vetorial: `SR_2026_grupo02_areas_queimadas.geojson`

Produtos raster terão protocolo próprio. Não enviar raster pesado diretamente ao GitHub Pages sem orientação específica.

## 5. Requisitos mínimos para GeoJSON
- SRC de distribuição Web: **EPSG:4326 — WGS 84**.
- Codificação: **UTF-8**.
- Geometria válida e compatível com o objetivo do trabalho.
- Manter somente atributos necessários à visualização e consulta.
- Evitar campos redundantes ou sem significado acadêmico.
- Generalizar geometrias quando necessário, preservando adequação cartográfica.
- Testar o arquivo no Laboratório Acadêmico antes da submissão.
- Como referência didática, buscar arquivos leves; o Laboratório atualmente impede arquivos acima de 10 MB.

## 6. Metadados mínimos
Cada submissão deve informar no Pull Request:
1. **Disciplina** — Geoprocessamento ou Sensoriamento Remoto.
2. **Ano/semestre**.
3. **Grupo e integrantes**.
4. **Título do produto/camada**.
5. **Descrição e finalidade**.
6. **Fonte dos dados** — instituição/base e, quando aplicável, ano/versão.
7. **Data ou período de referência dos dados**.
8. **SRC original** e **SRC de distribuição Web**.
9. **Tipo de geometria/produto** — ponto, linha, polígono etc.
10. **Principais procedimentos realizados** — recorte, reprojeção, seleção, simplificação, cálculo, classificação etc.
11. **Atributos principais** disponibilizados.
12. **Responsabilidade/limitações** — observações sobre escala, precisão, generalização ou restrições de uso.
13. **Confirmação de teste** no Laboratório GeoEdu.

## 7. Commit
Utilizar mensagem curta e descritiva, preferencialmente em inglês para manter consistência técnica do repositório.

Exemplos:
- `Add Group 03 Maranhão road network`
- `Add Group 02 burned areas GeoJSON`
- `Update Group 03 road network metadata`

## 8. Pull Request
O título deve identificar disciplina, grupo e produto.

Exemplo: `GEO 2026 — Grupo 03 — Rodovias do Maranhão`

O corpo do Pull Request deve utilizar o modelo de metadados fornecido pelo repositório. O envio de um Pull Request é uma **submissão para revisão**, e não significa publicação automática.

## 9. Critérios de revisão pelo Professor/GEOPRO
A revisão considerará: procedência da fonte; adequação do SRC; validade da geometria; coerência dos atributos; qualidade do processamento; adequação cartográfica; desempenho WebGIS; metadados; nomenclatura; e funcionamento no GeoEdu.

O Pull Request poderá ser aprovado, receber solicitação de ajustes ou não ser incorporado à versão oficial.

## 10. Princípio de integridade
Não devem ser submetidos dados pessoais, sensíveis, sigilosos, sem autorização de uso ou cuja publicação possa produzir risco indevido. A fonte e as condições de uso dos dados devem ser respeitadas.