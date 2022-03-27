/* 
TALK TO ME - ECAL 2022 - AB.
Serial communication via Web USB
Main app
contains helper functions
public functions must be exposed in the return function
*/

const talkApp = (function () {
  ('use strict');
  let port;

  document.addEventListener('DOMContentLoaded', (event) => {
    let connectButton = document.querySelector('#connect');
    let statusDisplay = document.querySelector('#status');

    function connect() {
      port.connect().then(
        () => {
          statusDisplay.textContent = '';
          connectButton.textContent = 'Disconnect';
          document.body.style.backgroundColor = 'lightgreen';
          serial.is_connected = 1;
          console.clear();
          port.onReceive = (data) => {
            let textDecoder = new TextDecoder();
            if (data.getInt8() === 13) {
              // currentReceiverLine = null;
            } else {
              talkCommands.commandInterpret(textDecoder.decode(data));
            }
          };

          port.onReceiveError = (error) => {
            console.error(error);
            port.disconnect();
            serial.is_connected = 0;
            connectButton.textContent = 'Connect';
            statusDisplay.textContent = error;
            port = null;
            document.body.style.backgroundColor = 'lightgray';
          };
        },
        (error) => {
          statusDisplay.textContent = error;
        }
      );
    }

    connectButton.addEventListener('click', function () {
      if (port) {
        port.disconnect();
        connectButton.textContent = 'Connect';
        statusDisplay.textContent = '';
        port = null;
        document.body.style.backgroundColor = 'lightgray';
        serial.is_connected = 0;
      } else {
        serial
          .requestPort()
          .then((selectedPort) => {
            port = selectedPort;
            connect();
          })
          .catch((error) => {
            statusDisplay.textContent = error;
          });
      }
    });

    serial.getPorts().then((ports) => {
      if (ports.length === 0) {
        statusDisplay.textContent =
          'No device found. Plug your device and press Connect';
      } else {
        statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();
      }
    });

    let testButtons = document.querySelectorAll('.testbutton');
    for (let i = 0; i < testButtons.length; i++) {
      testButtons[i].addEventListener('click', function (e) {
        const t = e.target;
        const btn = t.id.substring(3, 4);
        talkCommands.pressButton(btn);
      });
    }
  });

  function sendCommand(data) {
    port.send(new TextEncoder('utf-8').encode(data)); //'L0042';
  }
  /* PUBLIC MEMBERS */
  return {
    sendCommand: sendCommand,
  };
})();
