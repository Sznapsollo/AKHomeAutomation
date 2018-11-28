<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("../Class.ItemChecker.php");
require_once("../Class.Settings.php");

$id = null;

if(isset($input->receive))
{
	if(isset($input->id))
		$id = $input->id;
}

if($id)
{
	$itemChecker = new ItemChecker();
	$settings = new Settings();

	$item = $itemChecker->checkSensor($id);	
	
	$returnData = new stdClass();
	
	if($item)
	{
		$filepathname = $settings->sensorsettingsfilesPath.$item->id.'.json';
		$sensorInfoText = null;
		$overrideSensorData = null;
	
		if (file_exists($filepathname)) { $sensorInfoText = file_get_contents($filepathname); }
		
		if($sensorInfoText)
		{
			$item = json_decode($sensorInfoText);
			$overrideSensorData = true;
		}
		$folderSecured = false;
		if(file_exists(dirname(__FILE__).DIRECTORY_SEPARATOR.'.htaccess'))
			$folderSecured = true;
		
		$returnData = array('id' => $item->id, 'alarmTimeUnits' => $item->alarmTimeUnits, 'onAlarm' => $item->onAlarm, 'customData' => $overrideSensorData, 'folderSecured' => $folderSecured );
	}

	echo json_encode($returnData);
}

?>
