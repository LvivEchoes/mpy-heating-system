from . import device


class Rule:
    def __init__(self) -> None:
        self._condition = []
        self._action = []

    def check_condition(self):
        return all(map(lambda c: c, self._condition))

    @property
    def action(self):
        return self._action


_condition = [('temp_1', '>', 12)]
_action = [('pomp_1', '1')]


class Reactor:
    def __init__(self) -> None:
        super().__init__()
        self._rules = {}

    @property
    def rules(self):
        return self._rules

    def run(self):
        pass

    def load_rules(self):
        pass
