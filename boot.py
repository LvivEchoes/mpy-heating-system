import network

IP_ADDRESS="0.0.0.0"

def connect():
    ssid = "bulochka"
    password =  "i122i122"

    station = network.WLAN(network.STA_IF)

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
