let modifiedFeatures = [];
// Function to handle file input change
function handleFileInputChange(event) {
  modifiedFeatures = []
  const file = event.target.files[0];
  if (!file) return;

  // Read the file as text
  const reader = new FileReader();
  reader.onload = function(event) {
    const frontName = prompt("Enter a file name:", "F1");
    const content = event.target.result;
    const geojson = JSON.parse(content);
    const focPattern = /FOC\s*-?\s*(\d+)/g;      
    const geojsonTable = document.getElementById('geojsonTable');
    geojsonTable.querySelector('tbody').innerHTML = '';

    let index = 0
    geojson.features.forEach(feature => {
      if (feature.properties.Name && focPattern.test(feature.properties.Name)) {
        const matches = feature.properties.Name.match(focPattern);
        feature.properties.Name2 = matches[0]
        feature.properties.Name3 = frontName + '=' + feature.properties.Name
      }
      else if (feature.properties.ID && focPattern.test(feature.properties.ID)) {
        const matches = feature.properties.ID.match(focPattern);
        feature.properties.Name2 = matches[0]
        feature.properties.Name3 = frontName + '=' + feature.properties.ID
      }
      else{
        if(feature.properties.Name != undefined){
          feature.properties.Name2 = feature.properties.Name
          feature.properties.Name3 = frontName + '=' + feature.properties.Name
        }
        else if(feature.properties.ID != undefined){
          feature.properties.Name2 = feature.properties.ID
          feature.properties.Name3 = frontName + '=' + feature.properties.ID
        }
        else{
          feature.properties.Name2 = ''
          feature.properties.Name3 = ''
        }
      }
      const newRow = document.createElement('tr');
      let IDName = feature.properties.ID
      let Name = feature.properties.Name
      let Name2 = feature.properties.Name2
      let Name3 = feature.properties.Name3

      // Set row content
      newRow.innerHTML = `
        <td>${index + 1}</td>
        <td>${IDName}</td>
        <td>${Name}</td>
        <td>${Name2}</td>
        <td>${Name3}</td>
      `;
      // Append the new row to the table
      geojsonTable.querySelector('tbody').appendChild(newRow);        
      index += 1
      const modifiedFeature = { ...feature, properties: { ...feature.properties} };
      modifiedFeatures.push(modifiedFeature);
    });
    // Display the table if it has rows
    geojsonTable.style.display = geojsonTable.querySelector('tbody').children.length > 0 ? 'block' : 'none'; //width: 100%;
    //downloadGeoJSON(modifiedFeatures);
    console.log(geojson);
  };
  reader.readAsText(file);
}
  
// Function to download GeoJSON file
function downloadGeoJSON() {
  data = modifiedFeatures
  const json = JSON.stringify({ type: "FeatureCollection", features: data });
  const blob = new Blob([json], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const fileName = prompt("Enter a file name:", "modified_geojson.json");
  if (fileName) {
    a.download = fileName;
    a.click();
  }
}

// Add event listener for file input change
document.getElementById('fileInput').addEventListener('change', handleFileInputChange);

const downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', downloadGeoJSON);
