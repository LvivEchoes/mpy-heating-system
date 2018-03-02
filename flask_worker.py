import json

from flask import Flask, redirect, render_template
from flask import request

app = Flask(__name__)
app._static_folder = "board/runner/static"

from btree_mpy import BTree

db = BTree()
db.open('db.db')

@app.route('/add_sensor')
def set_config(config):
    # db[]
    pass


@app.route('/get_config')
def get_config():
    return json.dumps(db.get('config', {}))


app.run()

config = {
    'temp' : {
        'id':1,
        'name':'Ddddd',
        'address':'123432432',
    },

}

values = {
    'sensor_1': 123,
}