async function kekw() {
  let a = await fetch(
    "https://appv.cloud/fixom/index.php/dashboard/tiket/get-data",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "sec-ch-ua":
          '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "upgrade-insecure-requests": "1",
        cookie:
          "FIXOM=eyJpdiI6ImpcL1JvUjNyaU5xMERJMlp6WjVhaTZnPT0iLCJ2YWx1ZSI6ImNKd21CNWFkbVd1aTYrVmlZVUo4Q0p2am9TQlRwUks5N3JwU21NR3VVWHVaSGNWcFdwZ3J3bDJJWktJZFdYempRaUpiUFFhMFNNYkRjQWZjZXE0Q3h1RTZGMFZYNmgzZURXYlF6T0NsNG1KZHFlTm84ekZaamd0Zkc4NEppQUQxIiwibWFjIjoiMWNhNzJkMTU5MGU1MDhkMDJlNDE5Y2QxM2RmNWFjZTI2M2RhMDQxMGRjOTVjYTA1MjIxODBmMGEwZWU5NWU5MSJ9",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
    }
  );
  //   a = a.json();
  console.log(await a.json());
}

kekw();
