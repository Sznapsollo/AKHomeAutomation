#!/usr/bin/env python
import datetime
import glob
import json
import os.path
import sys
import time

from subprocess import call
from pprint import pprint
from random import randint

from helpers import Helper
from helpers import RequestPropertyManager
from helpers import ProcessKill

helper = Helper()

class Process(object):
	def __init__(self, fromProcess):
		self.status = 'OFF'
		self.dayoffperformed = None
		self.randomStart = None
		self.randomEnd = None
		self.name = fromProcess['name']
		self.update(fromProcess)

	def disable(self):
		self.status = 'OFF'
		self.randomStart = None
		self.randomEnd = None

	def enable(self):
		self.status = 'ON'

	def update(self, fromProcess):
		self.timeUnits = fromProcess['timeUnits']

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
		processForList = Process(process)
		self.processList.append(processForList)
		helper.logMessage("added %s" % (processForList.name))
			
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
			timeUnitsCount = 0
			processMessage = "(status:%s) name: %s , day off perf: %s" % (process.status, process.name, process.dayoffperformed)
			for timeUnit in process.timeUnits:
				timeUnitsCount += 1
				processMessage += ",[Unit %s]" % str(timeUnitsCount)
				randomTimes = ""
				if 'random' in timeUnit and timeUnit['random']:
					if process.randomStart is not None:
						randomTimes += " randomStart: " + process.randomStart
					if process.randomEnd is not None:
						randomTimes += " randomEnd: " + process.randomEnd
				processMessage += " start: %s end: %s %s days: %s" % (timeUnit['timeStart'], timeUnit['timeEnd'], randomTimes, timeUnit['daysOfWeek'])
			helper.logMessageWithDate(processMessage)

	def processCount(self):
		return len(self.processList)

class Checker(object):
	def __init__(self, process):
		self.process = process

	def parseHoursAndMinutes(self, timeStart, timeEnd):
		return {
			"hourStart" : timeStart.split(':')[0] if timeStart else '0',
			"minuteStart" : timeStart.split(':')[1] if timeStart else '0',
			"secondStart" : '0',
			"hourEnd" : timeEnd.split(':')[0] if timeEnd else '23',
			"minuteEnd" : timeEnd.split(':')[1] if timeEnd else '59',
			"secondEnd" : '59' if not timeEnd else '0'
		}

	def validate(self):

		timeUnits = self.process.timeUnits
		today = datetime.datetime.today()

		actionToPerform = "NONE"

		for timeUnit in timeUnits:

			timeStart = timeUnit['timeStart']
			timeEnd = timeUnit['timeEnd']

			hoursAndMinutes = self.parseHoursAndMinutes(timeStart, timeEnd)
			hourStart = hoursAndMinutes["hourStart"]
			minuteStart = hoursAndMinutes["minuteStart"]
			secondStart = hoursAndMinutes["secondStart"]
			hourEnd = hoursAndMinutes["hourEnd"]
			minuteEnd = hoursAndMinutes["minuteEnd"]
			secondEnd = hoursAndMinutes["secondEnd"]

			if 'random' in timeUnit and timeUnit['random']:
			
				if self.process.randomStart is None and self.process.randomEnd is None:

					startHourForRand = max(today.hour, int(hourStart))
					if today.hour > int(hourEnd) - 2:
						startHourForRand = int(hourStart)
					endHourForRand = int(hourEnd)

					randHourStart = randint(startHourForRand, endHourForRand)
					randHourEnd = randint(randHourStart, endHourForRand)
					
					startMinMinuteForRand = int(minuteStart) if randHourStart == int(hourStart) else 0
					startMaxMinuteForRand = int(minuteEnd) if randHourStart == int(hourEnd) else 59
					
					endMinMinuteForRand = int(minuteStart) if int(hourStart) == randHourEnd else 0
					endMaxMinuteForRand = int(minuteEnd) if randHourEnd == int(hourEnd) else 59

					randMinuteStart = randint(startMinMinuteForRand, startMaxMinuteForRand)
					randMinuteEnd = randint(endMinMinuteForRand, endMaxMinuteForRand)
					if(randHourStart == randHourEnd):
						while randMinuteEnd <= randMinuteStart:
							if randMinuteStart == 0:
								if randMinuteEnd == 0:
									randMinuteEnd += 5
								break
							randMinuteStart -= 1

					timeStart = str(randHourStart) + ":" + str(randMinuteStart)
					timeEnd = str(randHourEnd) + ":" + str(randMinuteEnd)
					
					self.process.randomStart = timeStart
					self.process.randomEnd = timeEnd
					
					helper.logMessage ("------ generated random start: %s end: %s for %s" % (timeStart, timeEnd, self.process.name))
				else:
					timeStart = self.process.randomStart
					timeEnd = self.process.randomEnd
					
					helper.logDetailedMessage ("------ obtained random start: %s end: %s for %s" % (timeStart, timeEnd, self.process.name))

			hoursAndMinutes = self.parseHoursAndMinutes(timeStart, timeEnd)
			hourStart = hoursAndMinutes["hourStart"]
			minuteStart = hoursAndMinutes["minuteStart"]
			secondStart = hoursAndMinutes["secondStart"]
			hourEnd = hoursAndMinutes["hourEnd"]
			minuteEnd = hoursAndMinutes["minuteEnd"]
			secondEnd = hoursAndMinutes["secondEnd"]

			todayDateTimeStart = datetime.datetime(today.year, today.month, today.day, int(hourStart), int(minuteStart), int(secondStart))
			todayDateTimeEnd = datetime.datetime(today.year, today.month, today.day, int(hourEnd), int(minuteEnd), int(secondEnd))

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
			self.process.enable()
		elif actionToPerform == "NONE" and self.process.status == "ON":    
			self.processRun(self.process, False)
			self.process.disable()
		elif actionToPerform == "OFF":    
			self.processRun(self.process, False)
			self.process.disable()
			self.process.dayoffperformed = today.weekday()

	def processRun(self, process, enable):
		requestProperties = RequestPropertyManager()
		requestProperties.setRequestProperties(process.name, -1, "on" if enable else "off", "Scheduled")
		if enable:
			helper.runDeviceAction(requestProperties)
		else:
			helper.runDeviceAction(requestProperties)

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
