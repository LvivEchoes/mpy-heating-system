from flask import Flask, render_template, redirect

app = Flask(__name__)


@app.route('/')
def root():
    return redirect('/automation/'), 302


@app.route('/automation/')
def automation():
    return render_template('index.html')

@app.route('/automation/add')
def automation_add():
    return render_template('automation/add.html')
