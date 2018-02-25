import gc
import picoweb
import uasyncio

gc.collect()

from runner.worker_loop import w1
from runner import c
from runner.web import app

gc.collect()

loop = uasyncio.get_event_loop()
loop.create_task(w1.main_proc(c))

print('Starting app on {}'.format(IP_ADDRESS))
app.run(debug=True, host = "0.0.0.0")
