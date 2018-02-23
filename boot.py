import network

IP_ADDRESS="0.0.0.0"

def _connect():
    ssid = "bulochka"
    password =  "i122i122"
    

    station = network.WLAN(network.AP_IF)

    if station.isconnected() == True:
        print("Already connected")
        print(station.ifconfig())
        return

    station.active(True)
    station.connect(ssid, password)

    while station.isconnected() == False:
        pass

    print("Connection successful")
    print(station.ifconfig())
    IP_ADDRESS = station.ifconfig()

def connect():
    ap = network.WLAN(network.AP_IF)
    ap.config(essid='AUT')
    ap.config(authmode=3, password='123456789')
    ap.active(True)


connect()
