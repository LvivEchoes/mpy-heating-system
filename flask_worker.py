from flask import Flask, redirect, render_template

app = Flask(__name__)
app._static_folder = "board/runner/static"

from btree_mpy import BTree

db = BTree()
db.open('db.db')


@app.route('/automation_/')
def root():
    return render_template('/automation/'), 302


app.run()
