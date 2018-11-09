#!/usr/bin/env python

import time
import os
import sys
from sys import argv
from socket import timeout

from helpers import ItemChecker
from helpers import Helper
from helpers import RequestPropertyManager

scriptarg, namearg, timearg, codearg, statusarg, sourcearg = argv

itemChecker = ItemChecker()
helper = Helper()
requestProperties = RequestPropertyManager()

node = itemChecker.checkItem(namearg)

if node is None:
	helper.writeExceptionToFile("Not found " + str(namearg));

try:
	requestProperties.setRequestProperties(namearg, timearg, statusarg, sourcearg)

	#satellites notification is default
	notifySatellites = True
	if "notifySatellites" in node:
		notifySatellites = node["notifySatellites"]
	
	if notifySatellites is True:
		helper.runSatellitesDeviceAction(requestProperties,True)
	
	if helper.saveDailyLogsToFile:
		messageBody = "device " + str(namearg) + ", delay=" + str(timearg) + ", status=" + str(statusarg)
		if requestProperties.hasRequestSource() is True:
			messageBody += ", source=" + str(sourcearg)
		helper.writeLogToFile(time.strftime('actions/actions_%Y%m%d'), messageBody)
	
	if(int(timearg) > 0):
		time.sleep(int(timearg))

		if (node["sendOption"] == 2):
				helper.loadPage(itemChecker.getWebAction(node, codearg), 0)
		elif (node["sendOption"] == 1):
				helper.runRadioSwitch(helper.settings.data["conradCodeSendPath"],str(node[codearg]))
		elif (node["sendOption"] == 0):
				helper.runRadioSwitch(helper.settings.data["codeSendPath"],str(node[codearg]))

		helper.deleteFile(helper.settings.data["delayfilesPath"]+'{0}.json'.format(namearg))
		
		if helper.saveDailyLogsToFile:
			messageBody = "[AUTO] switch device " + str(namearg) + " with status=off"
			helper.writeLogToFile(time.strftime('actions/actions_%Y%m%d'), messageBody)
			
except Exception, e:
	message = "[delayed_action error] for: "
	for arg in argv:
		message += str(arg)
	message += str(e)
	helper.writeExceptionToFile(message)
	helper.logMessage(message)
	pass
except OSError:
	helper.writeExceptionToFile("Error on delayed_action for  "+node["name"]);
	pass
