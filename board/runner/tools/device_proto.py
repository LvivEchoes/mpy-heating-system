import random
import asyncio

from btree_mpy import BTree

TEMP_KEY = 'temp'
CLAP_KEY = 'clap'
SENSOR_KEY = 'sensors'
PORT_KEY = 'port'
VALUES_KEY = 'values'
CONFIG_KEY = 'config'
ADDRESS_KEY = 'address'
DEVICE_KEY = 'device'
THREE_WAY_PORTS_DEF = ('port_1', 'port_2')
PORT_DEF = 'port'
POMP_KEY = 'pomp'
THREE_WAY_KEY = '3way'
PORT_1_DEF = 'port_1'
PORT_2_DEF = 'port_2'
PARAM_NAME = 'name'
PARAM_ADDRESS = 'address'
PARAM_PORT = 'port'
PARAM_PORT_1 = 'port_1'
PARAM_PORT_2 = 'port_2'
PARAM_TYPES = (PARAM_NAME, PARAM_ADDRESS, PARAM_PORT, PARAM_PORT_1, PARAM_PORT_2)


class Device:
    def __init__(self) -> None:
        self.db = BTree()
        self.db.open('db.json')
        self._output_ports = self.get_device_ports()
        self._input_ports = []

    def delete_config(self, config):
        delete_config = dict(config)
        key, id = delete_config.get('device', ['_'])[0].split('_', maxsplit=1)
        curent_config = self.get_config()
        values = self.get_values()

        if curent_config.get(key, {}).get(id):
            del self.db['config'][key][id]
            self.db.flash()
            keys_to_del = f'{key}_{id}'
            if values.get(keys_to_del):
                del self.db['values'][keys_to_del]
            return True

        return False

    def rename_config(self, config):
        dict_config = dict(config)
        current_config = self.get_config()

        key, idx = dict_config.get('device', '_')[0].split('_', maxsplit=1)
        new_name = dict_config.get('new_name', None)
        if new_name is None:
            return False
        else:
            new_name = new_name[0]
        if current_config.get(key, {}).get(idx):
            self.db[CONFIG_KEY][key][idx][PARAM_NAME] = new_name
            self.db.flash()
            return True

    def set_config(self, config):
        dict_config = dict(config)
        current_config = self.get_config()
        new_id = None
        for c, v in dict_config.items():
            if '_' not in c: continue
            key, param = c.split('_', maxsplit=1)

            if not current_config.get(key):
                print('{} not in config.'.format(key))
                continue
            if param not in PARAM_TYPES:
                print('{} not implemented.'.format(param))
                continue
            if not new_id:
                new_id = str(int(sorted(list(map(lambda i: int(i), current_config[key].keys())))[-1]) + 1)
                self.db["config"][key][new_id] = {}

            if isinstance(v, list):
                v = v[0]

            self.db["config"][key][new_id][param] = v
            print(f'self.db["config"][{key}][{new_id}][{param}] = {v}')

        self.db.flash()

    def get_values(self):
        return self.db.get(VALUES_KEY, {}).copy()

    def get_config(self):
        return self.db.get(CONFIG_KEY, {}).copy()

    def get_device_ports(self):
        return self.db.get(DEVICE_KEY, {}).get(PORT_DEF, [])

    def scan_devices(self):
        return [
            "gsdgabc123ba",
            "sgabc123bafd",
            "fgfabc123baf",
            "dgdfabc123ba",
            "aaaabbbccc12"
        ]

    def _get_used_3way_ports(self):
        three_way_claps = [(w[PORT_1_DEF], w[PORT_2_DEF]) for w in
                           self.get_config().get(THREE_WAY_KEY, {}).values()]
        used_ports = []
        for p1, p2 in three_way_claps:
            used_ports.append(int(p1))
            used_ports.append(int(p2))

        return used_ports

    def _get_used_clap_ports(self):
        return [int(c[PORT_DEF]) for c in self.get_config().get(CLAP_KEY, {}).values()]

    def _get_used_pomp_ports(self):
        return [int(c[PORT_DEF]) for c in self.get_config().get(POMP_KEY, {}).values()]

    def get_used_output_ports(self):
        return self._get_used_3way_ports() + self._get_used_clap_ports() + self._get_used_pomp_ports()

    def get_used_sensors(self):
        return [c[ADDRESS_KEY] for c in self.get_config().get(TEMP_KEY, {}).values()]

    def get_available_devices(self):
        detected_sensors = self.scan_devices()
        available_sensors = list(set(detected_sensors).difference(self.get_used_sensors()))

        available_ports = list(set(self._output_ports).difference(self.get_used_output_ports()))

        available_devices = {TEMP_KEY: available_sensors, PORT_KEY: available_ports}
        return available_devices

    def get_temp(self, address):
        return random.randrange(15, 25)

    def get_port_status(self, port):
        if isinstance(port, str):
            port = int(port)
        return random.randrange(0, 2)

    def set_value(self, key, value):
        self.db[VALUES_KEY][key] = value
        self.db.flash()

    @asyncio.coroutine
    def async_fetch_values(self):
        while True:
            config = self.get_config()
            for k, v in config.items():
                for idx, item in v.items():
                    value = None

                    if k == TEMP_KEY:
                        address = v.get('address')
                        value = self.get_temp(address)
                    elif k in (POMP_KEY, CLAP_KEY):
                        port = v.get(PORT_KEY)
                        value = self.get_port_status(port)
                    elif k == THREE_WAY_KEY:
                        port_1 = v.get(PORT_1_DEF)
                        port_2 = v.get(PORT_2_DEF)

                        # Need some work here
                        value = self.get_port_status(port_1)
                    if value is not None:
                        print(f'Set {k}_{idx} as {value}')
                        self.set_value(f'{k}_{idx}', value)

                    yield
                yield
            yield from asyncio.sleep(5)
