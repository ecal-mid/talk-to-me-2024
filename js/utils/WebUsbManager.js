export default class WebUsbManager {
  constructor(parent, connectButton, statusDisplay) {
    this.port = null;
    this.serial = {};
    this.parent = parent;
    this.connectButton = connectButton;
    this.statusDisplay = statusDisplay;
    this.init();
    this.initSerial();
  }

  init() {
    this.connectButton.addEventListener('click', this.handleConnect.bind(this));
  }

  initSerial() {
    this.serial.is_connected = 0;
    this.serial.Port = function (device) {
      this.device_ = device;
      this.interfaceNumber = 0;
      this.endpointIn = 0;
      this.endpointOut = 0;
    };

    this.serial.requestPort = function () {
      const filters = [
        { vendorId: 0x239a }, // Adafruit boards
        { vendorId: 0xcafe }, // TinyUSB example
        { vendorId: 0x2e8a }, // RP2040
        { vendorId: 0x000a }, // RP2040
      ];
      return navigator.usb
        .requestDevice({ filters: filters })
        .then((device) => new this.Port(device));
    };

    this.serial.getPorts = function () {
      return navigator.usb.getDevices().then((devices) => {
        return devices.map((device) => new this.Port(device));
      });
    };

    this.serial.getPorts().then((ports) => {
      if (ports.length === 0) {
        this.statusDisplay.textContent =
          'No device found. Plug your device and press Connect';
      } else {
        this.statusDisplay.textContent = 'Connecting...';
        this.port = ports[0];
        this.connect();
      }
    });

    this.serial.Port.prototype.connect = function () {
      let readLoop = () => {
        this.device_.transferIn(this.endpointIn, 64).then(
          (result) => {
            this.onReceive(result.data);
            readLoop();
          },
          (error) => {
            this.onReceiveError(error);
          }
        );
      };

      return this.device_
        .open()
        .then(() => {
          if (this.device_.configuration === null) {
            return this.device_.selectConfiguration(1);
          }
        })
        .then(() => {
          var interfaces = this.device_.configuration.interfaces;
          interfaces.forEach((element) => {
            element.alternates.forEach((elementalt) => {
              if (elementalt.interfaceClass == 0xff) {
                this.interfaceNumber = element.interfaceNumber;
                elementalt.endpoints.forEach((elementendpoint) => {
                  if (elementendpoint.direction == 'out') {
                    this.endpointOut = elementendpoint.endpointNumber;
                  }
                  if (elementendpoint.direction == 'in') {
                    this.endpointIn = elementendpoint.endpointNumber;
                  }
                });
              }
            });
          });
        })
        .then(() => this.device_.claimInterface(this.interfaceNumber))
        .then(() =>
          this.device_.selectAlternateInterface(this.interfaceNumber, 0)
        )
        .then(() =>
          this.device_.controlTransferOut({
            requestType: 'class',
            recipient: 'interface',
            request: 0x22,
            value: 0x01,
            index: this.interfaceNumber,
          })
        )
        .then(() => {
          readLoop();
        });
    };

    this.serial.Port.prototype.disconnect = function () {
      return this.device_
        .controlTransferOut({
          requestType: 'class',
          recipient: 'interface',
          request: 0x22,
          value: 0x00,
          index: this.interfaceNumber,
        })
        .then(() => this.device_.close());
    };

    this.serial.Port.prototype.send = function (data) {
      return this.device_.transferOut(this.endpointOut, data);
    };
  }

  handleConnect() {
    if (this.port) {
      this.port.disconnect();
      this.connectButton.textContent = 'Connect';
      this.statusDisplay.textContent = '';
      this.port = null;
      document.body.style.backgroundColor = 'lightgray';
      serial.is_connected = 0;
    } else {
      this.serial
        .requestPort()
        .then((selectedPort) => {
          this.port = selectedPort;
          this.connect();
        })
        .catch((error) => {
          this.statusDisplay.textContent = error;
        });
    }
  }

  handleSend(data) {
    if (this.serial.is_connected == 1) {
      this.port.send(new TextEncoder('utf-8').encode(data)); //'L0042';
    }
  }

  handleReceive(data) {
    this.parent.handleReceiveUSBCommand(data);
  }

  connect() {
    this.port.connect().then(
      () => {
        this.statusDisplay.textContent = '';
        this.connectButton.textContent = 'Disconnect';
        document.body.style.backgroundColor = 'lightgreen';
        this.serial.is_connected = 1;
        this.port.onReceive = (data) => {
          let textDecoder = new TextDecoder();
          if (data.getInt8() === 13) {
            // currentReceiverLine = null;
          } else {
            this.handleReceive(textDecoder.decode(data));
          }
        };

        this.port.onReceiveError = (error) => {
          console.error(error);
          this.port.disconnect();
          this.serial.is_connected = 0;
          this.connectButton.textContent = 'Connect';
          this.statusDisplay.textContent = error;
          this.port = null;
          document.body.style.backgroundColor = 'lightgray';
        };
      },
      (error) => {
        this.statusDisplay.textContent = error;
      }
    );
  }
}
