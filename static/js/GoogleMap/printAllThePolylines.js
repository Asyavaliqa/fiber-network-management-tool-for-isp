import printMainConnection from './printPolylineConnection/printMainConnection.js';
import printMainLocalConnection from './printPolylineConnection/printMainLocalConnection.js';
import printPointToPointConnection from './printPolylineConnection/printPointToPointConnection.js';
import printLocalSplitter from './printPolylineConnection/printLocalSplitter.js';
import printHomeConnection from './printPolylineConnection/printHomeConnection.js';
import printLocalFiberConnection from './printPolylineConnection/printLocalFiberConnection.js';

const printAllThePolylines = async (map) => {
  const response = await fetch('/api/getAllConnection');
  const { data: allThePath } = await response.json();
  allThePath.forEach((connection) => {
    if (connection.type === 'pointToPoint')
      printMainConnection(connection, map);
    else if (connection.type === 'corporate')
      printPointToPointConnection(connection, map);
    else if (connection.type === 'reseller')
      printMainLocalConnection(connection, map);
    else if (connection.type === 'localFiber')
      printLocalFiberConnection(connection, map);
    else if (connection.type === 'splitter')
      printLocalSplitter(connection, map);
    else if (connection.type === 'home') printHomeConnection(connection, map);
  });
};

export default printAllThePolylines;
