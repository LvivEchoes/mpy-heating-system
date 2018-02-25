
class Counter:
    def __init__(self):
        self._value = 0

    def inc(self):
        self._value += 1

    @property
    def value(self):
        return self._value

c = Counter()
