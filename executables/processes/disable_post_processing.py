#!/usr/bin/env python

import time
from sys import argv
from helpers import Helper

scriptarg, namearg, timearg, statusarg = argv

helper = Helper()

try:
	if helper.saveDailyLogsToFile:
		messageBody = "switch device " + str(namearg) + " with status=" + str(statusarg)
		helper.writeLogToFile(time.strftime('actions/actions_%Y%m%d'), messageBody)

	helper.runSatellitesDeviceAction({'id':namearg, 'delay':timearg}, statusarg, False)
except Exception, e:
	message = "[disable_post_processing] for" +  namearg + " " + statusarg + " exc " + str(e)
	helper.writeExceptionToFile(message)
	helper.logMessage(message)
	pass
except OSError:
	helper.writeExceptionToFile("Error on disable_post_processing for  "+namearg);
	pass
