from flask import Flask, redirect

app = Flask(__name__)
app._static_folder = "/Users/ptsupka/Documents/pyb/board/runner/static"

from btree_mpy import BTree

db = BTree()
db.open('db.db')


@app.route('/add_rule/')
def root():
    return redirect('/automation/'), 302


app.run()
