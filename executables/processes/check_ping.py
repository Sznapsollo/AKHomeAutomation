#!/usr/bin/env python
import sys
import os
from sys import argv

scriptarg, ip = argv

if __name__ == "__main__":

	print os.system('ping '+ip+' -w 1')
