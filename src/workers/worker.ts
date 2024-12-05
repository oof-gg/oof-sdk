const connections: MessagePort[] = [];

const onconnect = function (e: MessageEvent) {
  const port = e.ports[0];
  connections.push(port);

  port.onmessage = function (event: MessageEvent) {
    // Broadcast the message to all connected ports
    connections.forEach((conn) => {
      if (conn !== port) {
        conn.postMessage(event.data);
      }
    });
  };

  port.start();
};