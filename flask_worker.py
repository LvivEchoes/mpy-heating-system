import json
from typing import Union
from quart import Quart, redirect, render_template
from quart import request
from board.runner.tools import device
import asyncio

app = Quart(__name__)
app._static_folder = "board/runner/static"


def adopt_quart_form_data(data):
    if app.__class__.__name__ != 'Quart':
        return data

    new_dict = {}
    for k, v in data.items():
        new_dict[k] = [v]
    return new_dict


@app.route('/add_device', methods=['POST'])
def set_config():
    form_data = yield from request.form

    device.set_config(adopt_quart_form_data(form_data))
    return json.dumps({})


@app.route('/rename_device', methods=['POST'])
def rename_config():
    form_data = yield from request.form
    device.rename_config(adopt_quart_form_data(form_data))
    return json.dumps({})


@app.route('/delete_device', methods=['POST'])
def delete_config():
    form_data = yield from request.form

    return json.dumps({'deleted': device.delete_config(adopt_quart_form_data(form_data))})


@app.route('/get_config')
def get_config():
    return json.dumps(device.get_config())
    # return json.dumps({})


@app.route('/get_values')
def get_values():
    return json.dumps(device.get_values())


@app.route('/get_available_devices')
def get_available_devices():
    return json.dumps(device.get_available_devices())


loop = asyncio.get_event_loop()

loop.create_task(device.async_fetch_values())
# loop.run_until_complete(asyncio.gather(feature))
app.run(host='127.0.0.1', port=5005)
