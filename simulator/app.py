import os
import simpy
import random as rd

from Factory import Factory

os.system('color')

class App:
    def __init__(self, day):
        self.env = simpy.Environment()
        self.factory = Factory(self.env, day, self)
        self.factory.add_production_line([0.02, 0.01, 0.05, 0.15, 0.07, 0.06])
        self.day = day

    def start(self, delay):
        self.factory.start()
        self.env.process(self.wait_for_end(delay))
        #print("=== Simulation Started ===")
        self.env.run(until=1000)
        #print("=== Simulation Finished ===")

        #self.factory.print_report()
        self.factory.print_for_csv()

    def wait_for_end(self, delay):
        yield self.env.timeout(delay)
        action = self.factory.get_action()
        if action and action.is_alive:
            action.interrupt()

    def alarm(self):
        action = self.factory.get_action()
        if action and action.is_alive:
            action.interrupt()
        #print("ALARM!!")


print("Production Line, Approved items, Rejected items, Total items, Work Station, Avg. Fixing time, Avg. Supplying "
          "time, Avg. Production Time WS, Avg. Production time PL, Day")
for i in range(100):
    app = App(i + 1)
    app.start(1000)
