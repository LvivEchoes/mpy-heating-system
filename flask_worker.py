from flask import Flask, redirect

app = Flask(__name__)
app._static_folder = "/Users/ptsupka/Documents/pyb/board_ajax/runner/static"

from fl import BTree

db = BTree()
db.open('db2')


@app.route('/add_rule/')
def root():
    return redirect('/automation/'), 302


app.run()
