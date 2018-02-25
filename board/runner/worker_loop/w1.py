from uasyncio import sleep

def main_proc(c):
    while True:
        yield from sleep(2)
        c.inc()
