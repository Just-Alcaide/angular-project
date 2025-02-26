import fs from 'fs';

export async function filter(file, filterParams, callback) {
  let filteredData = [];
  console.log('filter', filterParams);

  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, data) {
        const parsedData = JSON.parse(data.toString());

        // Filter by filterParams
        filteredData = parsedData.filter(item => {
          return Object.entries(filterParams).every(([key, value]) => {

            if (!value) return true;

            if (Array.isArray(item[key]) && Array.isArray(value)){
              return item[key].some(v => value.includes(v));
            } 

            if (key === 'ids' && Array.isArray(value)){
              return value.includes(item.id);
            }
            
            if (Array.isArray(item[key])){
              return item[key].includes(value);
            }

            return item[key] == value || String(item[key]).includes(value);
          });
        });

        if (filteredData.length === 0) {
          console.log('read', 'No se encontraron resultados');
          if (callback) {
            return callback('No se encontraron resultados');
          }
          return [];
        }
        if (err) {
          console.log('filter', err);
          return err;
        }
        // Return filtered data
        if (callback) {
          return callback(filteredData);
        }
        return filteredData
      });

    } else {
      console.log('filter', 'El fichero no existe');
      if (callback) {
        return callback('El fichero no existe');
      }
    }
  } catch (err) {
    console.log('filter', `Error: ${err}`);
    return err;
  }
}