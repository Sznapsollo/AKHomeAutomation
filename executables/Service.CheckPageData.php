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
	$returnData->translations = $settings->translations;
	
	echo json_encode($returnData);
}
?>