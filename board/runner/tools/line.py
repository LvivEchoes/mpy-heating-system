class Point:
    @staticmethod
    def global_slope(dx, dy):
        return (dy / dx) if dx else None

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def slope(self, target):
        return self.global_slope(target.x - self.x, target.y - self.y)

    def y_int(self, target):
        return self.y - self.slope(target) * self.x

    def line_function(self, target):
        slope = self.slope(target)
        y_int = self.y_int(target)

        def fn(x):
            return slope * x + y_int

        return fn
