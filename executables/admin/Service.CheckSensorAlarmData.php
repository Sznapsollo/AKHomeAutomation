<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("../Class.SensorChecker.php");
require_once("../Class.Settings.php");
require_once("Class.AdminHelpers.php");

$id = null;

if(isset($input->receive))
{
	if(isset($input->id))
		$id = $input->id;
}

if($id)
{
	$sensorChecker = new SensorChecker();
	$settings = new Settings();

	$item = $sensorChecker->checkSensor($id);	
	
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
		
		$returnData = array('id' => $item->id, 'alarmTimeUnits' => $item->alarmTimeUnits, 'onAlarm' => $item->onAlarm, 'customData' => $overrideSensorData, 'folderSecured' => AdminHelpers::IsFolderSecured() );
	}

	echo json_encode($returnData);
}

?>
