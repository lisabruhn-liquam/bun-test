const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getUsername() {
  return new Promise((resolve: (name: string) => void, reject) => {
    readline.question("Type your username:", (name: string) => {
      readline.close();
      resolve(name);
    });
  });
}

const username = await getUsername();
const connection = createConnection(username);

for await (const line of console) {
  connection.send(line);
}

function createConnection(username: string) {
  const socket = new WebSocket(`ws://localhost:3000?username=${username}`);
  socket.addEventListener("message", (event) => {
    if (event.data.includes(username + ":"))
      return process.stdout.write(username + ":");
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log(event.data);
    process.stdout.write(username + ":");
  });

  socket.addEventListener("op", (event) => {});

  return socket;
}
