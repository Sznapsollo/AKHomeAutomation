/*
 Usage: ./send <systemCode> <unitCode> <command>
 Command is 0 for OFF and 1 for ON
 */

#include "RCSwitch.h"
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char *argv[]) {
    
    /*
     output PIN is hardcoded for testing purposes
     see https://projects.drogon.net/raspberry-pi/wiringpi/pins/
     for pin mapping of the raspberry pi GPIO connector
     */
    int PIN = 0;
    int systemCode = atoi(argv[1]);
    
    if (wiringPiSetup () == -1) return 1;
	//printf("sending systemCode[%s] unitCode[%i] command[%i]\n", systemCode, unitCode, command);
	printf("sending systemCode[%i] \n", systemCode);
	RCSwitch mySwitch = RCSwitch();
	mySwitch.enableTransmit(PIN);
  
	//set up transmitter parameters
	mySwitch.setPulseLength(710); 
	mySwitch.setProtocol(2); 

	mySwitch.send(systemCode, 32); 


    return 0;
}
