import json
from typing import Union
from flask import Flask, redirect, render_template
from flask import request

app = Flask(__name__)
app._static_folder = "board/runner/static"

from btree_mpy import BTree

db = BTree()
db.open('db.json')


class Device:
    def scan_devices(self):
        return [
            "gsdgabc123ba",
            "sgabc123bafd",
            "fgfabc123baf",
            "dgdfabc123ba",
            "aaaabbbccc12"
        ]


def _get_config():
    return db.get('config', {})


@app.route('/add_sensor')
def set_config(config):
    # db[]
    pass


@app.route('/get_config')
def get_config():
    return json.dumps(_get_config())


@app.route('/get_values')
def get_values():
    return json.dumps(db.get('values', {}))


@app.route('/get_device_settings')
def get_device_settings():
    device_settings = db.get('device', {})
    detected_sensors = device_settings.get('detected_sensors', {})
    used_sensors = [s['address'] for s in _get_config().get('temp').values()]
    avalible_sensors = set(detected_sensors).difference(used_sensors)
    return json.dumps(list(avalible_sensors))


app.run(host='127.0.0.1', port=5005)
