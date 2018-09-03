#!/usr/bin/env python

import time
import os
import sys
from sys import argv
from socket import timeout

from helpers import ItemChecker
from helpers import Helper

scriptarg, namearg, timearg, codearg, processingstatusarg = argv

itemChecker = ItemChecker()
helper = Helper()

node = itemChecker.checkItem(namearg)

if node is None:
	helper.writeExceptionToFile("Not found "+namearg);

try:
	#satellites notification is default
	notifySatellites = True
	if "notifySatellites" in node:
		notifySatellites = node["notifySatellites"]
	
	if notifySatellites is True:
		helper.runSatellitesDeviceAction({'id':namearg, 'delay':timearg},str(processingstatusarg),True)
	
	if helper.saveDailyLogsToFile:
		messageBody = "switch device " + str(namearg) + " with delay=" + str(timearg) + ", status=" + str(processingstatusarg)
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
	message = "[delayed_action] node " + node["name"] + " exc " + str(e)
	helper.writeExceptionToFile(message)
	helper.logMessage(message)
	pass
except OSError:
	helper.writeExceptionToFile("Error on delayed_action for  "+node["name"]);
	pass
