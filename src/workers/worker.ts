const connections: MessagePort[] = [];

self.addEventListener('connect', (event: MessageEvent) => {
    console.log('[SharedWorker] Connected to SharedWorker:', event);
    const port = event.ports[0];

    connections.push(port);
    console.log('[SharedWorker] New client connected. Total clients:', connections.length);
    
    port.onmessage = function (event) {
        console.log('[SharedWorker] Worker received message:', event.data);
        connections.forEach((conn) => {
          if (conn !== port) {
            console.log('[SharedWorker] Worker sending message:', event.data);
            conn.postMessage(event.data);
          }
        });
    };

    // Get the MessagePort for this connection
    port.start();
});