import coreColor from '../utility/coreColor.js';
// this will get only the form data
const formData = () => {
  const connectionName = document.getElementById('mainConnectionName').value;
  const connectionTotalCore = Number(
    document.getElementById('mainConnectionCoreOptions').value
  );
  return { connectionName, connectionTotalCore };
};

// this wil do all the process of adding the new main connection
export default async (coordinates) => {
  const { connectionName, connectionTotalCore } = formData();
  const selectedCoreColor = coreColor.slice(0, connectionTotalCore);

  const connectionCoreColor = {};
  selectedCoreColor.forEach((item) => {
    connectionCoreColor[item.colorName] = null;
  });

  const mainConnection = {
    name: connectionName,
    totalCore: connectionTotalCore,
    coordinates,
  };

  const response = await fetch('/api/ptp-connection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mainConnection),
  });

  const { status, data } = await response.json();

  if (status === 'success') {
    location.reload();
  } else {
    console.log(status, data);
  }
};