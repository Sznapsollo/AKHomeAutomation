<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("../Class.ItemChecker.php");
require_once("../Class.Settings.php");
require_once("../Class.Helpers.php");

$itemChecker = new ItemChecker();
$settings = new Settings();
$id = null;
$timeLine = null;
$onDevices = null;

if(isset($input->receive))
{
	if(isset($input->id))
		$id = $input->id;
		
	if(isset($input->timeLine))
		$timeLine = $input->timeLine;
		
	if(isset($input->onDevices))
		$onDevices = $input->onDevices;
}

if($id)
{
	$item = $itemChecker->checkSensor($id);	

	if(!Helpers::MakeDir($settings->sensorsettingsfilesPath))
		return "No sensoractionfiles dir";
	
	$filepathname = $settings->sensorsettingsfilesPath.$item->id.'.json';	

	$sensorInfoText = null;
	$sensorInfoObject = null;
	
	if (file_exists($filepathname)) { $sensorInfoText = file_get_contents($filepathname); }
	
	if($sensorInfoText)
	{
		$sensorInfoObject = json_decode($sensorInfoText);
	}
	else
	{
		$sensorInfoObject = $item;
	}
	
	if($timeLine)
	{
		$timeUnits = explode("|",$timeLine);
		$index = 0;
	
		foreach($timeUnits as $timeUnitLine)
		{
			$timeUnitData = explode("#", $timeUnitLine);
			if(count($timeUnitData) == 3)
			{
				$timesArray[] = array('timeStart' => $timeUnitData[0], 'timeEnd' => $timeUnitData[1], 'daysOfWeek' => $timeUnitData[2]);
			}
			else if(count($timeUnitData) == 2)
			{
				$timesArray[] = array('timeStart' => $timeUnitData[0], 'timeEnd' => $timeUnitData[1], 'daysOfWeek' => '');
			}
		}
		
		$sensorInfoObject->alarmTimeUnits = $timesArray;
		file_put_contents($filepathname, json_encode($sensorInfoObject));
		chmod($filepathname, 0755);
	}
	else if($onDevices)
	{
		$sensorInfoObject->onAlarm = $onDevices;
		file_put_contents($filepathname, json_encode($sensorInfoObject));
		chmod($filepathname, 0755);
	}
	else
	{
		if (file_exists($filepathname))
			unlink($filepathname);
	}
}
?>
