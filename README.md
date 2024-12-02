# oof.gg SDK
This is the official oof.gg SDK for TypeScript/JavaScript. It allows you to interact with the oof.gg WSS/APIs.

## Installation
```npm i @oof.gg/sdk```

## Usage
```typescript
import { GameSDK, SDKConfig } from '@oof.gg/sdk';
export const main = async () => {
  const sdkConfig: SDKConfig = {
    authUrl: '/auth',
    socketUrl: 'ws://0.0.0.0:9090',
    apiUrl: '/api'
  }

  const oof = new GameSDK(sdkConfig);

  const token = 'your-jwt-token';
  await oof.connect(token);

  // Socket events
  oof.events.websocket.game.emit('REGISTER_PLAYER', payload);
  oof.events.websocket.game.on('INIT', (data) => {
    console.log(data);
  });

  // Local events
  oof.events.local.on('ABORT', (data) => {
    console.log('ABORT event received:', data);
  });
  
  oof.events.local.on('STOP', (data) => {
    console.log('STOP event received:', data);
  });

  //Close Button that triggers the ABORT event
  const closeButton = document.getElementById('closeButton');
  closeButton?.addEventListener('click', () => {
    oof.events.local.emit('ABORT', {
      reason: 'User closed the game'
    });
  });
}
```


## TODO
- [ ] Add more examples
- [ ] Add more documentation
- [ ] Authenticated requests