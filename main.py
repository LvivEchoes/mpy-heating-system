import picoweb
import uasyncio

from worker_loop import w1

class Counter:
    def __init__(self):
        self._value = 0

    def inc(self):
        self._value += 1

    @property
    def value(self):
        return self._value

c = Counter()

def root():
    return redirect('/automation/'), 302

def automation(req, resp):
    return render_template('index.html')

def automation_add():
    return render_template('automation/add.html')

def index(req, resp):
    yield from picoweb.start_response(resp)
    yield from resp.awrite("Hello world from picoweb running on the ESP32 {}.".format(c.value))


ROUTES = [
    ("/", index),
    ("/automation/", automation),
    ("/automation/add", automation_add)
]

loop = uasyncio.get_event_loop()
loop.create_task(w1.main_proc(c))

app = picoweb.WebApp(__name__, ROUTES)


print('Starting app on {}'.format(IP_ADDRESS))
app.run(debug=True, host = "0.0.0.0")
