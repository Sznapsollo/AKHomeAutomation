#!/usr/bin/env python

import json
import os.path
import smbus
import smtplib
import subprocess, signal
import sys
import time
import traceback
import threading
import urllib
import urllib2
from socket import timeout
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText

class Settings(object):

	def __init__(self):
		self.settingsFile = open(os.path.join(os.path.dirname(__file__),os.pardir,'settings.json'))
		self.data = json.load(self.settingsFile)
		
class ItemChecker(object):

	def __init__(self):
		self.nodesFile = open(os.path.join(os.path.dirname(__file__),os.pardir,'nodes.json'))
		self.lists = json.load(self.nodesFile)
		
	def checkItem(self, name):
		for node in self.lists["nodes"]:
			if node["name"] == name:
				return node
				
	def getWebAction(self, node, action):
		codeValue = ''
		if action == 'codeOn':
			codeValue = str(self.codeOn(node))
		else:
			codeValue = str(node[action])
			
		return str(node["address"])+"?check=1&" + codeValue
		
	def codeOn(self, node):
		return str(node["codeOn"][0])

	def checkSensor(self, id):
		for sensor in self.lists["sensors"]:
			if sensor["id"] == id:
				return sensor

	def getSensors(self):
		return self.lists["sensors"]

class Helper(object):

	loggingEnabled = False
	detailedLogging = False
	saveDailyLogsToFile = True
	saveDailySensorLogsToFile = True
	regularActionsCheckInterval = 60
	checkSensorsUpdateCheckInterval = 60
	sensorOnTimeMargin = 30

	def __init__(self):
		self.maxConnections = 3
		self.settings = Settings()
		
		if "saveDailyLogsToFile" in self.settings.data:
			self.saveDailyLogsToFile = self.settings.data["saveDailyLogsToFile"]
			
		if "saveDailySensorLogsToFile" in self.settings.data:
			self.saveDailySensorLogsToFile = self.settings.data["saveDailySensorLogsToFile"]

	def checkLuminosity(self):
		# Get I2C bus
		bus = smbus.SMBus(1)
		 
		bus.write_byte_data(0x39, 0x00 | 0x80, 0x03)
		bus.write_byte_data(0x39, 0x01 | 0x80, 0x02)
		 
		time.sleep(0.00005)
		data = bus.read_i2c_block_data(0x39, 0x0C | 0x80, 2)
		data1 = bus.read_i2c_block_data(0x39, 0x0E | 0x80, 2)
		 
		# Convert the data
		ch0 = data[1] * 256 + data[0]
		ch1 = data1[1] * 256 + data1[0]
		 
		# Output data to screen
		#self.logDetailedMessage("Full Spectrum(IR + Visible) :"+str(ch0)+" lux")
		#self.logDetailedMessage("Infrared Value :"+str(ch1)+" lux")
		#self.logDetailedMessage("Visible Value :"+str(ch0 - ch1)+" lux")

		luminosity = {}
		luminosity["fullSPectrum"] = ch0
		luminosity["infrared"] = ch1
		luminosity["visibleValue"] = ch0-ch1

		return luminosity["visibleValue"]

	def deleteFile(self, filePath):
		if os.path.isfile(filePath):
				os.unlink(filePath)

	def loadPage(self, url, retries):
		self.loadPageWithPost(url, None, retries)

	def loadPageWithPost(self, url, post, retries):
		if retries > 0:
				self.logDetailedMessage('Retry web connection to: ' + url)
		if retries > self.maxConnections:
				self.logDetailedMessage('Max web connection exceeded to: ' + url)
				return	

		try:
			if post is not None:
				data = urllib.urlencode(post)
				urllib2.urlopen(url,data)
			else:
				urllib2.urlopen(url)
		except urllib2.URLError as e:
			if hasattr(e, 'reason'):
				self.logDetailedMessage('Failed to reach server')
				self.logDetailedMessage('Reason: ' + str(e.reason))
				self.logDetailedMessage('Reatempting in 10 seconds ...')
				self.writeExceptionToFile(str(e.reason) + ' ' + url)
				time.sleep(10)
				self.loadPage(url, retries + 1)
			elif hasattr(e, 'code'):
				self.logDetailedMessage('Server failed porcessing request')
				self.logDetailedMessage('Error code: ' + str(e.code))
				self.logDetailedMessage('Reatempting in 10 seconds ...')
				self.writeExceptionToFile(str(e.code) + ' ' + url)
				time.sleep(10)
				self.loadPage(url, retries + 1)
		except timeout:
			self.logDetailedMessage('Server failed due to timeout')
			self.logDetailedMessage('Reatempting in 10 seconds ...')
			self.writeExceptionToFile('Server failed due to timeout to ' + url)
			time.sleep(10)
			self.loadPage(url, retries + 1)
		except Exception, e:
			message = "[loadPageWithPost] exc " + str(e)
			self.writeExceptionToFile(message)
			self.logMessage(message)
			pass
			
	def logDetailedMessage(self, message):
		if self.loggingEnabled and self.detailedLogging:
			self.logMessage (message)

	def logMessage(self, message):
		if self.loggingEnabled:
			timestamp = time.strftime('[%Y-%m-%d %H:%M:%S]: ')
			print (timestamp+message+"\n")

	def runDeviceAction(self, device, status, iteration):
		self.runDeviceActionInner(self.settings.data["webServerAddress"], device, status, iteration)

	def runSatellitesDeviceAction(self, device, status, async):
		try:
			#pass to satellites if defined
		   if "satelliteServerAddresses" in self.settings.data:
				for serverAddr in self.settings.data["satelliteServerAddresses"]:
					if self.settings.data["webServerAddress"] not in serverAddr:
						if async:
							t = threading.Thread(target=self.runDeviceActionInner, args=(serverAddr,device,status,0.0))
							t.start()
						else:
							self.runDeviceActionInner(serverAddr,device,status,0.0)
		except Exception, e:
			message = "[Exception passing signal to satellites] exc " + str(e)
			self.writeExceptionToFile(message)
			self.logMessage(message)
			
	def runDeviceActionInner(self, serverAddress, device, status, iteration):
		if iteration > 0:
		   time.sleep(float(iteration))
		   
		postData = {'outletId' : device["id"], 'outletStatus'  : status, 'outletDelayed': device["delay"]}
		messageBody = "switch device " + str(device["id"]) + " ,status " + status + " ,delay " + str(device["delay"])
		
		self.logMessage(messageBody)

		self.loadPageWithPost(serverAddress + "/executables/toggle.php", postData, 0)

	def runRadioSwitch(self, name, code):
		command = "python " + self.settings.data["mainPath"] + "executables/processes/run_radio_switch.py " + name +" "+ code
		os.system(command)

	def sendAlarmNotification(self, subject, message):
		if "sensorAlarmMail" in self.settings.data:
			try:
				serverMailData = self.settings.data["sensorAlarmMail"]
				if serverMailData["enableMailingOnAlarm"]:
					self.logDetailedMessage('sending mail...')
					fromaddr = serverMailData["fromaddr"]
					toaddr = serverMailData["toaddr"]
					msg = MIMEMultipart()
					msg['From'] = fromaddr
					msg['To'] = toaddr
					msg['Subject'] = subject
					 
					body = message
					msg.attach(MIMEText(body, 'plain'))
					 
					server = smtplib.SMTP(serverMailData["smtpServerAddress"], serverMailData["smtpServerPort"])
					server.starttls()
					server.login(fromaddr, serverMailData["password"])
					text = msg.as_string()
					server.sendmail(fromaddr, toaddr, text)
					server.quit()
				else:
					self.logDetailedMessage('sensorAlarmMail.enableMailingOnAlarm disabled')
			
			except Exception, e:
				message = "[Exception sendAlarmNotification] exc " + str(e)
				self.writeExceptionToFile(message)
				self.logMessage(message)
				
	def writeExceptionToFile(self, text):
		try:
			timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
			filePath = self.settings.data["mainPath"]+time.strftime('logs/exceptions/exceptions_%Y%m%d.log')

			directory = os.path.dirname(filePath)
			
			if not os.path.exists(directory):
					os.makedirs(directory)
			
			with open(filePath, 'a+') as excFile:
				excFile.write(str(timestamp + ': ' + text + '\r\n' + traceback.format_exc()+ '\r\n'))
		except Exception, e:
			message = "[Exception file save error'] exc " + str(e)
			self.logMessage(message)

	def writeLogToFile(self, filename, text):
		try:
			timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
			filePath = self.settings.data["mainPath"]+'logs/'+filename+'.log'

			directory = os.path.dirname(filePath)
			
			if not os.path.exists(directory):
				os.makedirs(directory)
			
			with open(filePath, 'a+') as excFile:
				excFile.write(str(timestamp + ': ' + text + '\r\n'))
		except Exception, e:
			message = "[Log file save error'] exc " + str(e)
			self.writeExceptionToFile(message)
			self.logMessage(message)

class ProcessKill(object):

	def __init__(self, helper, name):
                self.helper = helper

		''' if another instance running then kill it '''
		proc1 = subprocess.Popen(['ps','-ef'], stdout=subprocess.PIPE)
		proc2 = subprocess.Popen(['grep', 'python'], stdin=proc1.stdout, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

		proc1.stdout.close() # Allow proc1 to receive a SIGPIPE if proc2 exits

		out, err = proc2.communicate()

		count = 0
		'''print("ile wierszy ", count)'''

		for line in out.splitlines():
			count += 1;
			if(name in line):
				self.helper.logDetailedMessage("[ProcessKill] file found: " + name)
				
				try:
						self.helper.deleteFile(helper.settings.data["delayfilesPath"]+'{0}.json'.format(name))
				except Exception, e:
						message = "[ProcessKill] exc " + str(e)
						self.helper.writeExceptionToFile(message)
						self.helper.logMessage(message)
						pass
				except OSError:
					pass
				
				pid = int(line.split(None, 2)[1])
				os.kill(pid,signal.SIGKILL)
			
				'''
				print("killed process id ", pid)
				print(line)
				print('***',line.split(None, 2)[1],'***')
				'''    
				'''
				root      7356  7349 29 20:49 pts/0    00:00:00 python ./var/www/html/wylaczniki/processes/process_delayed_action.py 2 69972
				('***', '7356', '***')
				('ile wierszy ', 5)
				'''
