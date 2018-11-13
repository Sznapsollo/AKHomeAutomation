<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("Class.Settings.php");

if(isset($input->receive)) {

	$settings = new Settings();
	$returnData = new stdClass();

	$todayexcfilepathname = '../logs/exceptions/exceptions_'.date("Ymd").'.log';
	
	$returnData->pageflags = new stdClass();
	$returnData->pageflags->todayexcexists = file_exists($todayexcfilepathname);
	$returnData->pageflags->canChangeAlarmSettings = $settings->canChangeAlarmSettings;
	$returnData->pageflags->serverDateTime = new stdClass();
	$returnData->pageflags->serverDateTime->serverTimeStamp = time();
	$returnData->pageflags->serverDateTime->serverCompareTime = date('H:i');
	$returnData->pageflags->logsDropdownFilter = $settings->logsDropdownFilter;
	$returnData->translations = $settings->translations;
	
	echo json_encode($returnData);
}
?>