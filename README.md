# Infanzia e obesità – dataviz Radar QN

Quattro dataviz per il pezzo di Radar – QN sulla Giornata dei diritti dell'infanzia (20 novembre 2026): obesità infantile, disuguaglianza e prezzi del cibo, dal mondo all'Italia. Pagine statiche (HTML, CSS, JS, D3 v7) che leggono i CSV in `data/`: per aggiornare un grafico basta cambiare il CSV. Tutti i numeri mostrati (titoli, etichette, tooltip, frasi) sono letti o calcolati dai CSV.

Indice con anteprime e snippet: `index.html` → https://lorenzobuonarosa.github.io/obesita_italia/

| # | Cartella | Titolo | Forma | CSV | Altezza iniziale |
|---|---|---|---|---|---|
| 1 | `sorpasso/` | Per la prima volta nel mondo ci sono più ragazzi obesi che sottopeso | Linee | `data/sorpasso.csv` | 670 |
| 2 | `disuguaglianza/` | Dove la ricchezza è distribuita peggio, i bambini pesano di più | Scatter + big number | `data/disuguaglianza.csv` | 845 |
| 3 | `regioni/` | Più si va a Sud, più i bambini hanno chili di troppo | Tile map | `data/regioni.csv` | 895 |
| 4 | `carrello/` | Il carrello si è ristretto, ma non per tutti | Giochino | `data/carrello.csv` | 575 |

Le altezze sono quelle misurate su desktop (760 px); lo script del CMS poi adatta l'altezza da solo (a 360 px: 780, 980, 875, 972; il carrello cresce di circa 150 px dopo "Scopri quanto ne riempi") e manda il tema del sito.

## Dati da verificare

1. **Sorpasso – 2023 e 2024 assenti.** Il rapporto UNICEF pubblica solo il 2025 proiettato (9,4% e 9,2%); i valori annuali 2023-2024 non sono pubblicati, quindi non sono nel CSV: il tratto tratteggiato va direttamente dal 2022 al 2025. Se UNICEF fornisce la serie annuale proiettata, basta aggiungere le righe con `tipo` = `proiezione`.
2. **Sorpasso – il punto d'incrocio disegnato** cade tra 2024 e 2025 sulla curva: è una conseguenza grafica della linea tra 2022 e 2025, non un dato. L'annotazione dice "Nel 2025", primo anno del CSV con obesità > sottopeso.
3. **Sorpasso – refuso nel rapporto**: a pag. 30 il PDF scrive "188 million children and adolescents aged 15–19 years"; nel resto del rapporto e nel comunicato la fascia è 5-19 anni. Usato 5-19.
4. **Disuguaglianza – valori letti dal grafico.** Il PDF del Report Card 20 non contiene la tabella per paese e l'allegato statistico ("Data Appendix spreadsheet") non è linkato nella pagina. I 43 valori sono stati ricavati dalle coordinate dei pallini nel grafico vettoriale della figura 6 (pag. 20), calibrate sulla griglia degli assi: precisione stimata ±0,01 sull'asse X e ±0,05 punti sull'asse Y. Controlli: Italia 5,35 (come atteso), Cile 58% e Giappone 16% (come nel testo), retta di regressione ricalcolata identica a quella arancione del rapporto. **Da sostituire con l'allegato statistico appena disponibile.**
5. **Disuguaglianza – indicatore.** L'asse della figura dice "P80–P20 ratio" (rapporto tra i redditi all'80° e al 20° percentile), ma il testo lo descrive come reddito del quinto più ricco rispetto al quinto più povero (S80/S20) e i valori sono quelli tipici dell'S80/S20. Nel grafico è descritto come "reddito del 20% più ricco diviso quello del 20% più povero". Da chiarire con UNICEF se serve precisione.
6. **Disuguaglianza – 1,7 volte.** Con i quinti di paesi (9 più diseguali contro 9 più egualitari) il rapporto viene **1,5**, non 1,7. L'1,7 del comunicato UNICEF (11-12 maggio 2026) non è nel PDF e torna con il confronto tra i **5** paesi più diseguali e i 5 più egualitari (1,74), lo stesso schema del "2,4 volte" sulla mortalità. Il big number usa quindi 5 contro 5, calcolato dal CSV; la nota sotto il grafico riporta anche il valore con i quinti.
7. **Disuguaglianza – Italia "22ª su 40 per disuguaglianza"**: nella figura 6 (43 paesi) l'Italia è 24ª dal più egualitario. Non ho trovato nel PDF la classifica su 40; il dato non è mostrato nel grafico.
8. **Disuguaglianza – Colombia esclusa**: è tra i 44 paesi ma non compare nella figura 6.
9. **Regioni – fonte dei valori.** Sovrappeso e obesità (grave compresa) vengono tutti dalla figura 8 "Sovrappeso e obesità per Regione – OKkio 2023" dei report regionali ISS (pag. 18 del report Lombardia), l'unica tabella con tutte le 21 regioni e province. L'eccesso di peso è la somma delle due. In alcuni report regionali i valori nel testo differiscono di 0,1-0,2 punti (pesature regionali): Abruzzo (sovrappeso 21,6, eccesso 35,4 nel testo), Lazio (19,7), Liguria (18,2 e 9,1; eccesso 27,2), Sicilia (13,4 di obesità; eccesso 33,9), Bolzano (3,2 di obesità). Tutti i valori di controllo tornano: Italia 19,0 / 9,8 / 2,6 / 28,8; Campania 24,6 / 12,6+6,0 / 43,2 / 2019 44,2; Emilia-Romagna 25,7; Umbria 18,4 / 7,0+1,2 / 26,6.
10. **Regioni – obesità grave mancante** per **Basilicata, Calabria, Molise e Sardegna**: non hanno pubblicato il report regionale 2023 su EpiCentro (al 18/11/2026). Sovrappeso e obesità ci sono (dalla figura 8), l'obesità grave no: nel tooltip "n.d.". Il quadrato non è grigio perché l'eccesso di peso è disponibile.
11. **Regioni – Trento**: il report provinciale dà valori interi (13% sovrappeso, 3% obesi, 1% obesità grave, 17% eccesso). Sovrappeso e obesità sono presi dalla figura 8 (12,6 e 3,9); l'obesità grave è 1,0 = "1%" arrotondato (segnalato nel tooltip).
12. **Regioni – 2019**: eccesso di peso 2019 = sovrappeso + obesità dal grafico 3 "Sovrappeso e obesità per Regione – OKkio 2019" (report regionale Lombardia 2019). Italia 2019: 29,8.
13. **Carrello**: valori Eurostat scaricati via API il 18/11/2026, da ricontrollare a campione su prc_hicp_aind. (Controllati tutti e sette: coincidono con quelli forniti; ultimo aggiornamento della tabella 06/02/2026.)

## Fonti e trasformazioni

### 1. `sorpasso` – `data/sorpasso.csv`
- **2000-2022**: UNICEF Data Warehouse (API SDMX, dataflow `NUTRITION`, area `UNSDG_REGION_GLOBAL`, sesso ed età totali), indicatori `NT_SANT_5_19_BAZ_PO2_MOD` (obesità, IMC per età > +2 DS) e `NT_SANT_5_19_BAZ_NE2_MOD` (sottopeso/thinness, < −2 DS), 5-19 anni, stime grezze UNICEF su dati NCD-RisC. Arrotondati a un decimale.
- **2025**: UNICEF, *Feeding Profit – Child Nutrition Report 2025*, pag. 30 e comunicato del 10/09/2025: 9,4% obesi, 9,2% sottopeso; 188 e 184 milioni. Proiezione UNICEF: variazione media annua della prevalenza (in scala probit) 2010-2022 applicata dal 2022 in avanti (note alla figura 10).
- Punti di controllo: 2000 obesità 3,2% ("circa 3%"), sottopeso 12,9% ("quasi 13%"); 2025 9,4% e 9,2%: tornano. La versione "dal 2% al 9%, dal 6% al 5%" del comunicato non riguarda questa serie (probabilmente altra fascia d'età o i sotto i 5 anni): non usata.
- Colonne: `anno;obesita;sottopeso;tipo;obesi_milioni;sottopeso_milioni` (`tipo` = `stima` o `proiezione`).

### 2. `disuguaglianza` – `data/disuguaglianza.csv`
- UNICEF Innocenti, *Report Card 20 – Unequal Chances: Children and economic inequality* (maggio 2026), figura 6 (vedi punto 4 sopra). X: rapporto di reddito 80/20, ultimo anno disponibile (2023 o precedente; OCSE, Eurostat per Cipro e Malta, UNICEF per l'Uruguay). Y: sovrappeso (IMC > +1 DS, obesità compresa), 5-19 anni, 2022, NCD-RisC, media di maschi e femmine standardizzata per età.
- Posizione nella classifica del benessere: tabella 1 del rapporto (37 paesi; Australia, Belgio, Norvegia, Stati Uniti, Cipro, Israele e Lussemburgo non classificati).
- Big number: media del sovrappeso dei 5 paesi con il rapporto più alto diviso quella dei 5 con il più basso, calcolata in pagina dal CSV.

### 3. `regioni` – `data/regioni.csv`
- ISS, OKkio alla Salute 2023, bambini di 8-9 anni (terza primaria), soglie IOTF. Report regionali: https://www.epicentro.iss.it/okkioallasalute/indagine-2023-report-regionali
- `obesita` = obesi + gravemente obesi (nei report regionali sono due classi separate; nel dato nazionale l'obesità comprende la grave). `obesita_grave` dai singoli report. `eccesso_ponderale` = sovrappeso + obesità. La riga `Italia` (senza `col`/`riga`) dà la media nazionale.
- Classi della mappa: sotto 20, 20-25, 25-30, 30-35, 35 e oltre (soglie nel codice, `BREAKS`).
- Griglia: quella proposta, con Puglia, Basilicata, Calabria, Sicilia e Sardegna ritoccate per non lasciare buchi (Basilicata tra Campania e Puglia, 7 righe invece di 8).

### 4. `carrello` – `data/carrello.csv`
- Eurostat, HICP, tabella `prc_hicp_aind`, Italia, indici medi annui base 2015=100 (`INX_A_AVG`). Riempimento oggi = indice 2015 ÷ indice 2025 × 100, mostrato arrotondato all'unità. La riga `Totale alimentari` (CP011) dà solo la linea puntinata della media.
- Corrispondenze COICOP: CP01161 fresh or chilled fruit; CP01171 fresh or chilled vegetables other than potatoes; CP01173 dried vegetables, other preserved or processed vegetables; CP01114 other bakery products; CP01184 confectionery products; CP01222 soft drinks.
- Precisione del lettore: errore medio assoluto in punti sui sei sacchetti; su frutta e verdura fresche media dello scarto (stima − dato): oltre +3 ottimista, sotto −3 pessimista, altrimenti precisa.

## Snippet per il CMS

Ogni snippet contiene l'iframe e lo script (inline) che adatta l'altezza e manda il tema del sito. Se in un articolo ci sono più dataviz, lo script può restare in ognuna (grazie al controllo `__radarQNv2` non si ripete il lavoro) oppure si tiene una volta sola.

### 1. `sorpasso/` — altezza iniziale 670 px

```html
<iframe src="https://lorenzobuonarosa.github.io/obesita_italia/sorpasso/" width="100%" height="670" frameborder="0" scrolling="no" title="Per la prima volta nel mondo ci sono più ragazzi obesi che sottopeso"></iframe>
<script>
(function(){if(window.__radarQNv2)return;window.__radarQNv2=1;var O="https://lorenzobuonarosa.github.io";var MQ=window.matchMedia("(prefers-color-scheme:dark)");function frames(){return Array.prototype.filter.call(document.getElementsByTagName("iframe"),function(f){return(f.getAttribute("src")||"").indexOf(O+"/")===0;});}function theme(){var t=document.documentElement.getAttribute("data-theme");return t==="dark"||t==="light"?t:(MQ.matches?"dark":"light");}function bgOf(el){for(;el&&el.nodeType===1;el=el.parentElement){var c=getComputedStyle(el).backgroundColor;if(c&&c !=="transparent"&&!/rgba\([^)]*,\s*0\)$/.test(c))return c;}return null;}function send(f){try{f.contentWindow.postMessage({sentinel:"radar-qn",type:"theme",theme:theme(),bg:bgOf(f.parentElement)},O);}catch(e){}}function sendAll(){frames().forEach(send);}window.addEventListener("message",function(e){if(e.origin !==O)return;var d=e.data;if(!d||d.sentinel !=="radar-qn"||d.type !=="height")return;frames().forEach(function(f){if(f.contentWindow !==e.source)return;var h=Math.ceil(+d.height);if(h > 0&&20000 > h)f.style.height=h+"px";send(f);});});new MutationObserver(function(){sendAll();setTimeout(sendAll,400);}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});if(MQ.addEventListener)MQ.addEventListener("change",sendAll);})();
</script>
```

### 2. `disuguaglianza/` — altezza iniziale 845 px

```html
<iframe src="https://lorenzobuonarosa.github.io/obesita_italia/disuguaglianza/" width="100%" height="845" frameborder="0" scrolling="no" title="Dove la ricchezza è distribuita peggio, i bambini pesano di più"></iframe>
<script>
(function(){if(window.__radarQNv2)return;window.__radarQNv2=1;var O="https://lorenzobuonarosa.github.io";var MQ=window.matchMedia("(prefers-color-scheme:dark)");function frames(){return Array.prototype.filter.call(document.getElementsByTagName("iframe"),function(f){return(f.getAttribute("src")||"").indexOf(O+"/")===0;});}function theme(){var t=document.documentElement.getAttribute("data-theme");return t==="dark"||t==="light"?t:(MQ.matches?"dark":"light");}function bgOf(el){for(;el&&el.nodeType===1;el=el.parentElement){var c=getComputedStyle(el).backgroundColor;if(c&&c !=="transparent"&&!/rgba\([^)]*,\s*0\)$/.test(c))return c;}return null;}function send(f){try{f.contentWindow.postMessage({sentinel:"radar-qn",type:"theme",theme:theme(),bg:bgOf(f.parentElement)},O);}catch(e){}}function sendAll(){frames().forEach(send);}window.addEventListener("message",function(e){if(e.origin !==O)return;var d=e.data;if(!d||d.sentinel !=="radar-qn"||d.type !=="height")return;frames().forEach(function(f){if(f.contentWindow !==e.source)return;var h=Math.ceil(+d.height);if(h > 0&&20000 > h)f.style.height=h+"px";send(f);});});new MutationObserver(function(){sendAll();setTimeout(sendAll,400);}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});if(MQ.addEventListener)MQ.addEventListener("change",sendAll);})();
</script>
```

### 3. `regioni/` — altezza iniziale 895 px

```html
<iframe src="https://lorenzobuonarosa.github.io/obesita_italia/regioni/" width="100%" height="895" frameborder="0" scrolling="no" title="Più si va a Sud, più i bambini hanno chili di troppo"></iframe>
<script>
(function(){if(window.__radarQNv2)return;window.__radarQNv2=1;var O="https://lorenzobuonarosa.github.io";var MQ=window.matchMedia("(prefers-color-scheme:dark)");function frames(){return Array.prototype.filter.call(document.getElementsByTagName("iframe"),function(f){return(f.getAttribute("src")||"").indexOf(O+"/")===0;});}function theme(){var t=document.documentElement.getAttribute("data-theme");return t==="dark"||t==="light"?t:(MQ.matches?"dark":"light");}function bgOf(el){for(;el&&el.nodeType===1;el=el.parentElement){var c=getComputedStyle(el).backgroundColor;if(c&&c !=="transparent"&&!/rgba\([^)]*,\s*0\)$/.test(c))return c;}return null;}function send(f){try{f.contentWindow.postMessage({sentinel:"radar-qn",type:"theme",theme:theme(),bg:bgOf(f.parentElement)},O);}catch(e){}}function sendAll(){frames().forEach(send);}window.addEventListener("message",function(e){if(e.origin !==O)return;var d=e.data;if(!d||d.sentinel !=="radar-qn"||d.type !=="height")return;frames().forEach(function(f){if(f.contentWindow !==e.source)return;var h=Math.ceil(+d.height);if(h > 0&&20000 > h)f.style.height=h+"px";send(f);});});new MutationObserver(function(){sendAll();setTimeout(sendAll,400);}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});if(MQ.addEventListener)MQ.addEventListener("change",sendAll);})();
</script>
```

### 4. `carrello/` — altezza iniziale 575 px

```html
<iframe src="https://lorenzobuonarosa.github.io/obesita_italia/carrello/" width="100%" height="575" frameborder="0" scrolling="no" title="Il carrello si è ristretto, ma non per tutti"></iframe>
<script>
(function(){if(window.__radarQNv2)return;window.__radarQNv2=1;var O="https://lorenzobuonarosa.github.io";var MQ=window.matchMedia("(prefers-color-scheme:dark)");function frames(){return Array.prototype.filter.call(document.getElementsByTagName("iframe"),function(f){return(f.getAttribute("src")||"").indexOf(O+"/")===0;});}function theme(){var t=document.documentElement.getAttribute("data-theme");return t==="dark"||t==="light"?t:(MQ.matches?"dark":"light");}function bgOf(el){for(;el&&el.nodeType===1;el=el.parentElement){var c=getComputedStyle(el).backgroundColor;if(c&&c !=="transparent"&&!/rgba\([^)]*,\s*0\)$/.test(c))return c;}return null;}function send(f){try{f.contentWindow.postMessage({sentinel:"radar-qn",type:"theme",theme:theme(),bg:bgOf(f.parentElement)},O);}catch(e){}}function sendAll(){frames().forEach(send);}window.addEventListener("message",function(e){if(e.origin !==O)return;var d=e.data;if(!d||d.sentinel !=="radar-qn"||d.type !=="height")return;frames().forEach(function(f){if(f.contentWindow !==e.source)return;var h=Math.ceil(+d.height);if(h > 0&&20000 > h)f.style.height=h+"px";send(f);});});new MutationObserver(function(){sendAll();setTimeout(sendAll,400);}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});if(MQ.addEventListener)MQ.addEventListener("change",sendAll);})();
</script>
```

## Struttura

```
index.html        anteprime desktop + mobile e snippet "Copia"
data/             CSV (separatore ; e virgola decimale, UTF-8)
assets/           radar.css, radar.js, embed.js, embed.min.js, logo
sorpasso/ disuguaglianza/ regioni/ carrello/
```

Prova in locale: `python3 -m http.server` nella cartella e apri `http://localhost:8000/`. Sfondo forzabile con `?bg=grigio|bianco|nero|notte`.
