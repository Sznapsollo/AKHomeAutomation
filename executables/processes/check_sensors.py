import RPi.GPIO as GPIO
import time
import datetime
import sys
import glob
import threading
import os.path
import json
from pprint import pprint
from threading import Thread
from subprocess import call

from helpers import ItemChecker
from helpers import Helper

itemChecker = ItemChecker()
helper = Helper()

sensorsList = []
sensorsOverrideList = None;

GPIO.setmode(GPIO.BOARD)

class SensorBox(object):
	sensorsInBox = []
	def __init__(self):
		i=0

	def getSensor(self, id):
		for sensorinList in self.sensorsInBox:
			if sensorinList.id == id:
				return sensorinList
		return None
		
	def addSensor(self, sensor):
		self.sensorsInBox.append(sensor)
		helper.logDetailedMessage("added sensor " + sensor.id)
			
	def updateSensor(self, sensor):
		for n,sensorinList in enumerate(self.sensorsInBox):
			if sensor.id == sensorinList.id:
				
				for deviceOldSensor in sensorinList.onDevices:
					if "lastTriggered" in deviceOldSensor and deviceOldSensor["lastTriggered"] is not None:
						for deviceNewSensor in sensor.onDevices:
							if deviceNewSensor["id"] == deviceOldSensor["id"]:
								deviceNewSensor["lastTriggered"] = deviceOldSensor["lastTriggered"]
								helper.logDetailedMessage("transfered on sensor update lastTriggered value " + str(deviceOldSensor["lastTriggered"]) + " for device " + deviceNewSensor["id"] + " in sensor " + sensor.id)
								break

				self.sensorsInBox[n] = sensor
				helper.logDetailedMessage("updated sensor " + sensor.id)

	def removeSensor(self, sensor):
		self.sensorsInBox.remove(sensor)
		helper.logDetailedMessage("removed sensor " + sensor.id)

	def displaySensorsList(self):
		helper.logDetailedMessage ("displaySensorsList all sensors in box: %s" % (str(self.sensorsCount())))
		for sensorinList in self.sensorsInBox:
			helper.logDetailedMessage ("id: %s" % (sensorinList.id))
			
			for timeUnit in sensorinList.timeUnits:
				helper.logDetailedMessage ("------timeUnits------  start: %s end: %s days: %s" % (timeUnit['timeStart'], timeUnit['timeEnd'], timeUnit['daysOfWeek']))
			
			for timeUnit in sensorinList.alarmTimeUnits:
				helper.logDetailedMessage ("------alarmTimeUnits------  start: %s end: %s days: %s" % (timeUnit['timeStart'], timeUnit['timeEnd'], timeUnit['daysOfWeek']))
					
			for onUnit in sensorinList.onDevices:
				helper.logDetailedMessage ("------on------  id: %s delay: %s" % (onUnit['id'], onUnit['delay']))
			
			for onAlarmUnit in sensorinList.onAlarmDevices:
				helper.logDetailedMessage ("------onAlarm------  id: %s delay: %s" % (onAlarmUnit['id'], onAlarmUnit['delay']))
			
		helper.logDetailedMessage('--------------------------------')

	def sensorsCount(self):
		return len(self.sensorsInBox)

class Sensor(object):

	sensorDef = None
	seriesPoints = 0
	sendAlarmNotification = False
	previousEventTime = None

	def __init__(self, sensor):
		self.enabled = True
		if 'enabled' in sensor:
			self.enabled = sensor['enabled']	
		
		self.id = sensor['id']
		self.pin = sensor['pin']
		self.onDevices = sensor['on']
		self.onAlarmDevices = sensor['onAlarm']
		self.rebound = sensor['rebound']
		self.timeUnits = sensor['timeUnits']
		self.alarmTimeUnits = sensor['alarmTimeUnits']
		self.sensorDef = sensor
		self.lastValidSignal = datetime.datetime.now() - datetime.timedelta(0, self.rebound)
		self.lastValidAlarmSignal = datetime.datetime.now() - datetime.timedelta(0, self.rebound)
		GPIO.setup(self.pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
		self.messageSensorInfo("Initiating")

	def checkDependency(self, device, message):

		if "dependencyMethod" not in device or "dependencyValue" not in device or "dependencyOperation" not in device:
			return True
			
		#dependency will come for now only from helper class
		if device["dependencyMethod"] is not None and device["dependencyOperation"] is not None and device["dependencyValue"] is not None:

			if device["dependencyOperation"] == "grtr":
				currentValue = getattr(helper, device["dependencyMethod"])()
				if currentValue > device["dependencyValue"]:
					self.messageSensorInfo('['+device["id"]+'] dependency met '+ str(currentValue) + " > " + str(device["dependencyValue"]))
					message.body += '[Dp: ' + str(currentValue) + " > " + str(device["dependencyValue"]) + '] '
					return True
				else:
					self.messageSensorInfo('['+device["id"]+'] dependency NOT met '+ str(currentValue) + " > " + str(device["dependencyValue"]))
					return False
			if device["dependencyOperation"] == "lwr":
				currentValue = getattr(helper, device["dependencyMethod"])()
				if currentValue < device["dependencyValue"]:
					self.messageSensorInfo('['+device["id"]+'] dependency met '+ str(currentValue) + " < " + str(device["dependencyValue"]))
					message.body += '[Dp: ' + str(currentValue) + " < " + str(device["dependencyValue"]) + '] '
					return True
				else:
					self.messageSensorInfo('['+device["id"]+'] dependency NOT met '+ str(currentValue) + " < " + str(device["dependencyValue"]))
					return False
		return True

	def checkInput(self):
		
		if not self.enabled:
			self.messageSensorInfo('sensor disabled')
		
		newState = GPIO.input(self.pin)

		if newState == True and self.seriesPoints == 0:

			currentEventTime = datetime.datetime.now()
			self.messageSensorInfo('signal detected '+ currentEventTime.strftime("%Y-%m-%d %H:%M"))

			self.seriesPoints = 1

			if self.sendAlarmNotification is False and self.validateTimeUnits(self.alarmTimeUnits) is True:
				if self.checkReboundSeconds(currentEventTime, self.lastValidAlarmSignal, self.rebound, "[Alarm rebound] ") is False:
					self.lastValidAlarmSignal = currentEventTime
					self.sendAlarmNotification = True
					for alarmDevice in self.onAlarmDevices:
						threading.Thread(target=helper.runDeviceAction, args=(alarmDevice, "on")).start()

			if self.validateTimeUnits(self.timeUnits) is False:
				self.messageSensorInfo('out if time units bounds. Ignoring...')
				return

			if self.checkReboundSeconds(currentEventTime, self.lastValidSignal, self.rebound, "[Sensor rebound] "):
				return

			self.messageSensorInfo('valid signal detected!')
			
			if self.previousEventTime is not None:
				timeDifferenceSeconds = round(abs((currentEventTime-self.previousEventTime).total_seconds()))
				self.messageSensorInfo("seconds since last signal "+str(timeDifferenceSeconds))
			
			updateLastValidSignalDate = True

			
			for device in self.onDevices:
				
				onStatus = "on"
				
				#option for device by default not present in config file
				if "timeUnits" in device and self.validateTimeUnits(device["timeUnits"]) is False:
					self.messageSensorInfo("[Device "+device["id"]+"] out if time units bounds. Ignoring...")
					continue
				
				if self.checkReboundSeconds(currentEventTime, self.lastValidSignal, device["rebound"], "[Device "+device["id"]+"] "):
					updateLastValidSignalDate = False
					continue

				message = type('obj', (object,), {'body' : ''})
				if self.checkDependency(device, message) is False:
					updateLastValidSignalDate = False

					#if dependency not met so On but triggered lastly almost over
					if "lastTriggered" in device and device["lastTriggered"] is not None:
						deviceOffTime = device["lastTriggered"] + datetime.timedelta(0, (int)(device["delay"]))
						deviceOffTimeOffMargin = device["lastTriggered"] + datetime.timedelta(0, (int)(device["delay"]) - helper.sensorOnTimeMargin)
						if currentEventTime > deviceOffTimeOffMargin:
							self.messageSensorInfo("Device " + device["id"] + " delay time passed or will just pass("+str((deviceOffTime-currentEventTime).seconds)+"s). Its delay time is "+deviceOffTime.strftime('%Y-%m-%d %H:%M:%S')+". Checking Further...")
							message.body += "[ON] "
							onStatus = "offd"
						else:
							continue
					else:
						continue

				#checking if is still on by delay file
				delayFilePath = helper.settings.data["delayfilesPath"]+'{0}.json'.format(device["id"])
				if os.path.isfile(delayFilePath):
					with open(delayFilePath) as data_file:    
						data = json.load(data_file)
						if "time" in data and "delay" in data:
							#remove 30 to limit situatioons when device turns off and then on again on signal
							delaySeconds = (int)(data["delay"]) - helper.sensorOnTimeMargin;
							deviceOffTime = datetime.datetime.fromtimestamp(int(data["time"])) + datetime.timedelta(0, delaySeconds)
							
							if currentEventTime < deviceOffTime:
								self.messageSensorInfo("Device " + device["id"] + " is ON. Its delay time is "+deviceOffTime.strftime('%Y-%m-%d %H:%M:%S')+". Ignoring...")
								updateLastValidSignalDate = False
								continue

				message.body += "enabling device " + str(device["id"]) + ", delay " + str(device["delay"]) + ", status " + onStatus
				self.messageSensorInfo(message.body)

				if helper.saveDailySensorLogsToFile:
					helper.writeLogToFile(time.strftime('sensors/sensors_%Y%m%d'), message.body)

				device["lastTriggered"] = currentEventTime
				
				threading.Thread(target=helper.runDeviceAction, args=(device, onStatus)).start()

			if updateLastValidSignalDate:
				self.lastValidSignal = currentEventTime
							
			self.previousEventTime = currentEventTime
		elif newState == True and self.seriesPoints >= 1:
			self.seriesPoints = self.seriesPoints + 1
		elif newState == False and self.seriesPoints > 0:
			self.messageSensorInfo('series ended with points ' + str(self.seriesPoints))
			self.seriesPoints = 0

			if self.sendAlarmNotification is True:
				self.messageSensorInfo('sending alarm notification')
				self.sendAlarmNotification = False
				alarmMessageBody = "[Sensor "+self.id+"] triggered at " + time.strftime('[%Y-%m-%d %H:%M:%S]')
				helper.sendAlarmNotification("Sensor "+self.id+" triggered", alarmMessageBody)

		return

	def checkReboundSeconds(self, currentEventTime, againstTime, rebound, message):
		if againstTime is not None:
			timeDifferenceReboundSeconds = round(abs((currentEventTime-againstTime).total_seconds()))
			if timeDifferenceReboundSeconds <= rebound:
				self.messageSensorInfo(message + "seconds since last signal "+str(timeDifferenceReboundSeconds)+" do not exceed rebound limit which is " + str(rebound) + ". Ignoring...")
				return True
		return False

	def messageSensorInfo(self, message):
		helper.logDetailedMessage("[Sensor "+self.id+"] " + message)

	def validateTimeUnit(self, timeUnit):
		today = datetime.datetime.today()

		days = timeUnit['daysOfWeek'].split(',')

		if str(today.weekday()) in days:

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

			if(todayDateTimeStart <= today <= todayDateTimeEnd):
				return True
				
		return False

	def validateTimeUnits(self, timeUnits):
		for timeUnit in timeUnits:
			if self.validateTimeUnit(timeUnit):
				return True
		return False

def checkUpdatesSensors():
	threading.Timer(helper.checkSensorsUpdateCheckInterval, checkUpdatesSensors).start()

	helper.logMessage("checkUpdatesSensors")
	
	path = helper.settings.data["sensorsettingsfilesPath"]
	
	sensorIDsFromFiles = []

	for filename in glob.glob(os.path.join(path, '*.json')):
		with open(filename) as dataFile:
			sensorJsonData = json.load(dataFile)

			sensorID = sensorJsonData['id']
			if sensorID not in sensorIDsFromFiles:
				sensorIDsFromFiles.append(sensorID)
				
			if sensorsOverrideList.getSensor(sensorID) is None:
				sensorsOverrideList.addSensor(Sensor(sensorJsonData))
			else:
				sensorsOverrideList.updateSensor(Sensor(sensorJsonData))

	for sensorFromBox in sensorsOverrideList.sensorsInBox:
		if not sensorFromBox.id in sensorIDsFromFiles:
			sensorsOverrideList.removeSensor(sensorFromBox)
	
	sensorsOverrideList.displaySensorsList()

if __name__ == "__main__":

	try:

		if itemChecker.getSensors() is None:
			sys.exit(0)

		for sensor in itemChecker.getSensors():
			sensorsList.append(Sensor(sensor))
		
		sensorsOverrideList = SensorBox()
		
		checkUpdatesSensors()
		
		while True:
			for sensor in sensorsList:
				customSensorSetting = sensorsOverrideList.getSensor(sensor.id)
				if customSensorSetting is None:
					sensor.checkInput()
				else:
					customSensorSetting.checkInput()

			time.sleep(0.00005)

	except KeyboardInterrupt:
		GPIO.cleanup()
	except Exception as e:
		message = "[check_sensors] exc " + str(e)
		helper.writeExceptionToFile(message)
		helper.logMessage(message)
		pass
