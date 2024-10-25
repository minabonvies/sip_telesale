# BonTalk Doc

## Features

- A sip.js-based plugin
- Developers can adjust the style and theme of BonTalk
- BonTalk can be used as a phone call
- BonTalk can be installed anywhere on your web platform

## Installation

### Package manager

use npm:

```jsx
$ npm i @bonvies/bontalk
```

### CDN

```jsx

```

## Usage

Register the extension and ready to call…

```jsx
import BonTalk from '@bonvies/bontalk'

// create an usable sip phone instance
const bonTalk = new BonTalk({
  wsServer: "wss://bonuc.sbc.telesale.org:7443/ws",
  domains: ["bonuc.sbc.telesale.org"],
  username: "3005",
  password: "1234",
  displayName: "3005 John",
  panelConfig: {
    position: 'right',
    topOffset: 70,
    zIndex: 1000,
    responsive: [
      {
        breakpoint: 768,
        position: 'left',
        topOffset: 70,
        zIndex: 1000,
      },
      {
        breakpoint: 320,
        hidden: true
      }
    ]
  }
})

bonTalk.init()

// attach a event to a button
document.getElementById("toggleButton").addEventListener("click", () => {
  bonTalk.togglePanel()
})
```

Unregister and destroy the instance…

```jsx
bonTalk.destroy()
```

### Arguments

| Argument    | Data Type | Description                                                                |
| ----------- | --------- | -------------------------------------------------------------------------- |
| wsServer    | string    | a usable web socket server address                                       |
| domains     | string[ ] | place multiple PBX domains or IPs to prevent any PBX from working properly |
| username    | string    | authorization username of the extension                                    |
| password    | string    | authorization password of the extension                                    |
| displayName | string    | display name of the extension                                              |
| panelConfig | object    | panel configuration, see **Panel Configuration** for more details |
| responsive  | object[]  | responsive configuration, see **Responsive Configuration** for more details |

## Panel Configuration

| Property       | Data Type | Description                                                                                        |
| -------------- | --------- | -------------------------------------------------------------------------------------------------- |
| position       | string    | panel position, can be `left` or `right`                                                           |
| topOffset      | number    | panel top offset                                                                                   |
| zIndex         | number    | panel z-index                                                                                      |

## Responsive Configuration

| Property       | Data Type | Description                                                                                        |
| -------------- | --------- | -------------------------------------------------------------------------------------------------- |
| breakpoint     | number    | responsive breakpoint                                                                               |
| hidden         | boolean   | hidden the panel                                                                                    |
| position       | string    | panel position, can be `left` or `right`                                                           |
| topOffset      | number    | panel top offset                                                                                   |
| zIndex         | number    | panel z-index                                                                                      |

## Instance Methods

| Method         | Description                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------- |
| .init()        | render the panel and auto-register the agent’s extension, should only call once on every instance. |
| .destroy()     | destroy the panel. should call before destroy the element.                                         |
| .togglePanel() | open or close the panel.                                                                           |
