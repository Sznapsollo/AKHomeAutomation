#!/usr/bin/env python
import datetime
import glob
import json
import os.path
import sys
import time

from subprocess import call
from pprint import pprint

from helpers import ItemChecker
from helpers import Helper
from helpers import ProcessKill

itemChecker = ItemChecker()
helper = Helper()

class Process(object):
	def __init__(self, process, node):
		self.status = 'OFF'
		self.dayoffperformed = None
		self.name = process['name']
		self.sendOption = node['sendOption']
		self.update(process)
		
		if (node["sendOption"] == 2):
			self.codeOn = itemChecker.getWebAction(node, 'codeOn')
			self.codeOff = itemChecker.getWebAction(node, 'codeOff')
		else:
			self.codeOn = itemChecker.codeOn(node)
			self.codeOff = node['codeOff']

	def update(self, process):
		self.timeUnits = process['timeUnits']

class ProcessBox(object):
	processList = []
	def __init__(self):
		i=0

	def containsProcess(self, process):
		for processinList in self.processList:
			if process['name'] == processinList.name:
				return True
		return False

	def addProcess(self, process):
		node = itemChecker.checkItem(process["name"])
		
		if node is None:
			helper.writeExceptionToFile("Not found regular process to add "+process["name"])
		else:
			self.processList.append(Process(process, node))
			helper.logMessage("added")
			
	def updateProcess(self, process):
		for processinList in self.processList:
			if process['name'] == processinList.name:
				processinList.update(process)
				helper.logDetailedMessage("updated")

	def removeProcess(self, process):
		self.processList.remove(process)
		helper.logDetailedMessage("removed")

	def displayprocessList(self):
		for process in self.processList:
			helper.logDetailedMessage ("(status:%s) name: %s codeOn: %s codeOff: %s option: %s, day off perf: %s" % (process.status, process.name, process.codeOn, process.codeOff, process.sendOption, process.dayoffperformed))
			for timeUnit in process.timeUnits:
				helper.logDetailedMessage ("------ start: %s end: %s days: %s" % (timeUnit['timeStart'], timeUnit['timeEnd'], timeUnit['daysOfWeek']))
		helper.logDetailedMessage('--------------------------------')

	def processCount(self):
		return len(self.processList)

class Checker(object):
	def __init__(self, process):
		self.process = process

	def validate(self):

		timeUnits = self.process.timeUnits
		today = datetime.datetime.today()

		actionToPerform = "NONE"

		for timeUnit in timeUnits:
			timeStart = timeUnit['timeStart']
			timeEnd = timeUnit['timeEnd']
		
			hourStart = timeStart.split(':')[0] if timeStart else '0'
			minuteStart = timeStart.split(':')[1] if timeStart else '0'
			secondStart = 0
			hourEnd = timeEnd.split(':')[0] if timeEnd else '23'
			minuteEnd = timeEnd.split(':')[1] if timeEnd else '59'
			secondEnd = 59 if not timeEnd else 0

			todayDateTimeStart = datetime.datetime(today.year, today.month, today.day, int(hourStart), int(minuteStart), secondStart)
			todayDateTimeEnd = datetime.datetime(today.year, today.month, today.day, int(hourEnd), int(minuteEnd), secondEnd)

			days = timeUnit['daysOfWeek'].split(',')

			if str(today.weekday()) in days:
				
				if(not timeStart):
					if(todayDateTimeEnd < today and self.process.dayoffperformed is not today.weekday()):
						actionToPerform = "OFF"
				elif(todayDateTimeStart <= today <= todayDateTimeEnd):
					actionToPerform = "ON"
					break

		if actionToPerform == "ON" and self.process.status == "OFF":
			self.processRun(self.process, True)
			self.process.status = "ON"
		elif actionToPerform == "NONE" and self.process.status == "ON":    
			self.processRun(self.process, False)
			self.process.status = "OFF"
		elif actionToPerform == "OFF":    
			self.processRun(self.process, False)
			self.process.status = "OFF"
			self.process.dayoffperformed = today.weekday()

	def processRun(self, process, enable):
		if enable:
			helper.runDeviceAction({'id':process.name, 'delay':-1}, "on")
		else:
			helper.runDeviceAction({'id':process.name, 'delay':-1}, "off")

		time.sleep(2)

processBox = ProcessBox()

if __name__ == "__main__":

	path = helper.settings.data["regularactionfilesPath"]

	try:
		while True:

			processesNamesFromFiles = []

			for filename in glob.glob(os.path.join(path, '*.json')):
				with open(filename) as dataFile:
					processJsonData = json.load(dataFile)

					processName = processJsonData['name']
					if processName not in processesNamesFromFiles:
						processesNamesFromFiles.append(processName)
						
					if not processBox.containsProcess(processJsonData):
						processBox.addProcess(processJsonData)
					else:
						processBox.updateProcess(processJsonData)

			for processFromBox in processBox.processList:
				if not processFromBox.name in processesNamesFromFiles:
					processBox.removeProcess(processFromBox)
			
			for processFromBox in processBox.processList:
				checker = Checker(processFromBox)
				checker.validate()
			
			processBox.displayprocessList()
			
			time.sleep(helper.regularActionsCheckInterval)
	except Exception as e:
		message = "[regular_action] exc " + str(e)
		helper.writeExceptionToFile(message)
		helper.logMessage(message)
		pass
