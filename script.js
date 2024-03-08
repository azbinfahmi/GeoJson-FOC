// Function to handle file input change
function handleFileInputChange(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    // Read the file as text
    const reader = new FileReader();
    reader.onload = function(event) {
      const content = event.target.result;
      const geojson = JSON.parse(content);
      const focPattern = /FOC\d+/g;
      
      const geojsonTable = document.getElementById('geojsonTable');
      geojsonTable.querySelector('tbody').innerHTML = '';
      const modifiedFeatures = [];
      // Process each feature
      let index = 0
      let valueBefore, valueAfter
      geojson.features.forEach(feature => {
        // Check if "Name" property contains "FOC" followed by a number
        if (feature.properties.Name && focPattern.test(feature.properties.Name)) {
          const matches = feature.properties.Name.match(focPattern);
          // valueBefore = feature.properties.Name 
          valueBefore = `Name: ${feature.properties.Name}`
          feature.properties.Name2 = matches[0]
          feature.properties.Name3 = feature.properties.Name
        }
        // Check if "ID" property contains "FOC" followed by a number
        else if (feature.properties.ID && focPattern.test(feature.properties.ID)) {
          const matches = feature.properties.ID.match(focPattern);
          //valueBefore = feature.properties.ID
          valueBefore = `ID: ${feature.properties.ID}`
          feature.properties.Name2 = matches[0]
          feature.properties.Name3 = feature.properties.ID
        }
        else{
          if(feature.properties.Name != undefined){
            valueBefore = `Name: ${feature.properties.Name}`
            feature.properties.Name2 = feature.properties.Name
            feature.properties.Name3 = feature.properties.Name
          }
          else if(feature.properties.ID != undefined){
            valueBefore = `ID: ${feature.properties.ID}`
            feature.properties.Name2 = feature.properties.ID
            feature.properties.Name3 = feature.properties.ID
          }
          else{
            valueBefore = 'none'
            feature.properties.Name2 = ''
            feature.properties.Name3 = ''
          }
        }
        const newRow = document.createElement('tr');
        valueAfter = feature.properties.Name2
        // Set row content
        newRow.innerHTML = `
          <td>${index + 1}</td>
          <td>${valueBefore}</td>
          <td>${valueAfter}</td>
        `;
        // Append the new row to the table
        geojsonTable.querySelector('tbody').appendChild(newRow);        
        index += 1
        const modifiedFeature = { ...feature, properties: { ...feature.properties} };
        modifiedFeatures.push(modifiedFeature);
      });
      // Display the table if it has rows
      geojsonTable.style.display = geojsonTable.querySelector('tbody').children.length > 0 ? 'block' : 'none';
      downloadGeoJSON(modifiedFeatures);
      console.log(geojson);
    };
    reader.readAsText(file);
}
  
// Function to download GeoJSON file
function downloadGeoJSON(data) {
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
  