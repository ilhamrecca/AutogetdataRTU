// const fetch = require('node-fetch');
const Modbus = require("jsmodbus");
const net = require("net");

async function getRtuList() {
  try {
    const url = "http://localhost:4000/retensis/getRtuList";

    const options = {
      method: "GET",
      // headers: {
      //   "Content-Type": "application/json",
      // },
    };

    const fetchResponse = await fetch(url, options);
    const responseData = await fetchResponse.json();
    // console.log("Response from server:", responseData);
    const rtuList = responseData.rtuList;
    console.log(responseData.rtuList);
    for (let i = 0; i < rtuList.length; i++) {
      await myFunction(rtuList[i].ipAddress, rtuList[i].id);
    }
  } catch (error) {
    console.log(error);
  }
}

async function myFunction(host, id) {
  //   const host = "10.159.101.62"; // Replace with the IP address of your Modbus RTU device
  const port = 502; // Modbus TCP port

  const socket = new net.Socket();
  const client = new Modbus.client.TCP(socket);

  try {
    await new Promise((resolve, reject) => {
      socket.connect(port, host, () => {
        resolve();
      });

      socket.on("error", (err) => {
        reject(err);
      });
    });

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
      RTUid: id,
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

    const url = "http://localhost:4000/retensis/insertPowerData";

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(power),
    };

    const fetchResponse = await fetch(url, options);
    const responseData = await fetchResponse.json();
    console.log("Response from server:", responseData);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    socket.end();
    socket.destroy();
  }
}

async function scheduleNextExecution() {
  const now = new Date();
  const nextHour = new Date(now);

  nextHour.setHours(nextHour.getHours() + 1);
  nextHour.setMinutes(0);
  // nextHour.setMinutes(nextHour.getMinutes() + 1);
  // nextHour.setSeconds(nextHour.getSeconds() + 5);
  nextHour.setSeconds(0);
  nextHour.setMilliseconds(0);

  const timeUntilNextHour = nextHour - now;

  setTimeout(async () => {
    await getRtuList();
    scheduleNextExecution();
  }, timeUntilNextHour);
}

// Start the scheduling
scheduleNextExecution();
