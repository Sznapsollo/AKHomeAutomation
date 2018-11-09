#!/usr/bin/env python

import time
from sys import argv

from helpers import Helper
from helpers import RequestPropertyManager

scriptarg, namearg, timearg, statusarg, sourcearg, satellitesarg = argv

helper = Helper()
requestProperties = RequestPropertyManager()

try:
	requestProperties.setRequestProperties(namearg, timearg, statusarg, sourcearg)

	if helper.saveDailyLogsToFile:
		messageBody = "device " + str(namearg) + ", status=" + str(statusarg)
		
		if requestProperties.hasRequestSource() is True:
			messageBody += ", source=" + str(sourcearg)
		helper.writeLogToFile(time.strftime('actions/actions_%Y%m%d'), messageBody)

	if helper.str2bool(satellitesarg):
		helper.runSatellitesDeviceAction(requestProperties, False)
except Exception, e:
	message = "[disable_post_processing error] for: "
	for arg in argv:
		message += str(arg)
	message += str(e)
	helper.writeExceptionToFile(message)
	helper.logMessage(message)
	pass
except OSError:
	helper.writeExceptionToFile("Error on disable_post_processing for  "+namearg);
	pass
