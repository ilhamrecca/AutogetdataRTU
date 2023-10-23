const Modbus = require("jsmodbus");
const net = require("net");

// Define the TCP/IP connection details
const host = "10.159.111.60"; // Replace with the IP address of your Modbus RTU device
const port = 502; // Modbus TCP port

// Create a Modbus TCP client
const socket = new net.Socket();
const client = new Modbus.client.TCP(socket);

// Function to read data from the Modbus RTU device
async function readModbusData() {
  // Promisify the socket.connect method
  const connectPromise = new Promise((resolve, reject) => {
    socket.connect(port, host, () => {
      resolve();
    });
    socket.on("error", (error) => {
      reject(error);
    });
  });

  try {
    await connectPromise;

    // Read data from a specific register
    const unitId = 1; // Unit ID of the device
    const startAddress = 3; // Start address of the register
    const quantity = 41; // Number of registers to read
    const startAddressKW = 134;
    const quantityKW = 4;

    const response = await client.readHoldingRegisters(
      startAddress,
      quantity,
      unitId
    );

    const responseKW = await client.readHoldingRegisters(
      startAddressKW,
      quantityKW,
      unitId
    );
    const data = response.response._body.valuesAsArray;
    const dataKW = responseKW.response._body.valuesAsArray;
    console.log(data);
    console.log(dataKW);

    const power = {
      activePowerTotal: dataKW[3],
      activePower_R: dataKW[0],
      activePower_S: dataKW[1],
      activePower_T: dataKW[2],
      vAverage: (data[0] + data[1] + data[2]) / 3,
      iAverage: (data[3] + data[4] + data[5]) / 3,
      frequency: data[10],
      BBM: data[40],
    };
    console.log(power);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the connection
    socket.end();
    socket.destroy();
  }
}

// Call the async function to read Modbus data
readModbusData();
