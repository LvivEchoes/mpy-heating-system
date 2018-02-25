import json


class BTree(dict):
    def open(self, path):
        try:
            self._path = path
            self._db = open(path, "r+b")
            self.update(json.loads(self._db.read().decode()))
            self._db.close()

        except OSError:
            self._db = open(path, "wb")

            self._db.write(b'{}')
            self.flash()
            self._db.close()

    def flash(self):
        self.close()

    def close(self):
        self._db = open(self._path, "wb")

        self._db.write(json.dumps(self).encode())

        self._db.close()

    def __setitem__(self, k, v) -> None:
        super().__setitem__(k, v)
        self.flash()
