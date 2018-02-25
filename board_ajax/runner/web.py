import picoweb
import gc

from . import c

gc.collect()

def root(req, resp):
    return redirect('/automation/'), 302

def automation(req, resp):
    return app.render_template(resp,'index.html',())

def automation_add(req, resp):
    yield from picoweb.start_response(resp)
    f = open('/runner/templates/automation/add.html', 'r')
    for l in f:
        # return render_template('automation/add.html')
        yield from resp.awrite(l)
    f.close()

def index(req, resp):
    yield from picoweb.start_response(resp)
    yield from resp.awrite("Hello world from picoweb running on the ESP32 {}.".format(c.value))


ROUTES = [
    ("/", index),
    ("/automation/", automation),
    ("/automation/add", automation_add)
]

app = picoweb.WebApp(__name__, ROUTES)
