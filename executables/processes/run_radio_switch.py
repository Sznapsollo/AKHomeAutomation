#!/usr/bin/env python

# this is wrapper for radio switches only so the calls from different sources happenning perhaps on the same time
# would not call the transmitter at the same time making it work incorrectly
# it bases on checking fake lock on file and if lock exists (meaning transmitter is in use)
# process would wait untill lock is no more and then complete transmission

import time
import os
import sys
import fcntl
import errno
from subprocess import call
from sys import argv
from helpers import Helper

scriptarg, namearg, codearg = argv

helper = Helper()

try:
	radioLockFilePath = helper.settings.data["delayfilesPath"]+'{0}.lock'.format("radioLockFile")
	radioLockFile = open(radioLockFilePath, 'w+')
	while True:
		try:
			
			fcntl.flock(radioLockFile, fcntl.LOCK_EX | fcntl.LOCK_NB)
			helper.logMessage("[run_radio_switch] execute radio switch...")
			call([namearg,codearg])
			fcntl.flock(radioLockFile, fcntl.LOCK_UN)
			break
		except IOError as e:
			# raise on unrelated IOErrors
			if e.errno != errno.EAGAIN:
				raise
			else:
				helper.logMessage("[run_radio_switch] radio transmission locked. Waiting to retry...")
				time.sleep(0.2)
			
except Exception, e:
	message = "[run_radio_switch] node " + namearg + " " + codearg + " exc " + str(e)
	helper.writeExceptionToFile(message)
	helper.logMessage(message)
	pass
except OSError:
	helper.writeExceptionToFile("[run_radio_switch]  Error on delayed_action for  ");
	pass
