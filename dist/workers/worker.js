const connections = [];
self.addEventListener('connect', (event) => {
    console.log('Connected to SharedWorker:', event);
    const port = event.ports[0];
    connections.push(port);
    console.log('New client connected. Total clients:', connections.length);
    port.onmessage = function (event) {
        console.log('Worker received message:', event.data);
        connections.forEach((conn) => {
            if (conn !== port) {
                console.log('Worker sending message:', event.data);
                conn.postMessage(event.data);
            }
        });
    };
    // Get the MessagePort for this connection
    port.start();
});
const onconnect = function (e) {
    const port = e.ports[0];
    connections.push(port);
    console.log('Worker connected');
    port.onmessage = function (event) {
        // Broadcast the message to all connected ports
        console.log('Worker received message:', event.data);
        connections.forEach((conn) => {
            if (conn !== port) {
                console.log('Worker sending message:', event.data);
                conn.postMessage(event.data);
            }
        });
    };
    port.start();
};
