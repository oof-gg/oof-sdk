const connections: MessagePort[] = [];

self.addEventListener('connect', (event: MessageEvent) => {
    console.log('[SharedWorker] Connected to SharedWorker:', event);
    const port = event.ports[0];

    connections.push(port);
    console.log('[SharedWorker] New client connected. Total clients:', connections.length);
    
    port.onmessage = function (event: any) {
        console.log('[SharedWorker] Worker received message:', event.data);
        
        // Broadcast the message to all other connections
        connections.forEach((conn) => {
          if (conn !== port) {
            console.log('[SharedWorker] Worker sending message:', event.data);
            conn.postMessage(event.data);
          }
        });
        
        if(event.data.namespace === 'local') {
          // If the message eventType is CLOSE, close the port
          if (event.data.eventType === 'CLOSE') {
            console.log('[SharedWorker] Closing port:', port);
            const index = connections.indexOf(port);
            connections.splice(index, 1);
            port.close();
            self.close();
          }
        }
    };
});