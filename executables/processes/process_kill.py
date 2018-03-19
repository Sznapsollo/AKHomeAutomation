#!/usr/bin/env python
from sys import argv
import sys

from helpers import Helper
from helpers import ProcessKill

helper = Helper()

scriptarg, namearg = argv

try:
	delayKill = ProcessKill(helper, namearg)
except Exception, e:
	message = "Process Kill exc " + str(namearg) + str(e)
	helper.writeExceptionToFile(message)
	pass
