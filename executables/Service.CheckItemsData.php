<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("Class.ItemChecker.php");
require_once("Class.Settings.php");

$category = null;

if(isset($input->receive))
{
	if(isset($input->category))
		$category = $input->category;
}

if($category)
{
	$itemChecker = new ItemChecker();
	$settings = new Settings();

	$items = array();
	
	$returnData = new stdClass();
	$returnData->items = array();
	
	if($category == 'sensors')
	{
		$items = $itemChecker->getSensors();	

		foreach ($items as $item) {
			$filepathname = $settings->sensorsettingsfilesPath.$item->id.'.json';	
			$sensorInfoText = null;
			$overrideSensorData = null;
		
			if (file_exists($filepathname)) { $sensorInfoText = file_get_contents($filepathname); }
			
			if($sensorInfoText)
			{
				$item = json_decode($sensorInfoText);
				$overrideSensorData = true;
			}
			
			array_push($returnData->items, array('id' => $item->id, 'header' => $item->header, 'timeUnits' => $item->timeUnits, 'on' => $item->on, 'customData' => $overrideSensorData ));
		}
			
		$returnData->itemsDictionary = array();
		$itemsDictionary = $itemChecker->getItems(null);
		foreach ($itemsDictionary as $itemDictionary) {
			array_push($returnData->itemsDictionary, array('id' => $itemDictionary->name, 'header' => $itemDictionary->header));
		}
	}
	else
	{
		$items = $itemChecker->getItems($category);	
	
		foreach ($items as $item) {
			if($item instanceof IntItem)
				array_push($returnData->items, array('id' => $item->name, 'type' => $item->type, 'image'=> $item->image(), 'delay' => $item->delay/60, 'header' => $item->header, 'question' => $item->question, 'enableOn' => $item->enableOn, 'enableOff' => $item->enableOff));
			else if($item instanceof GroupItem || $item instanceof MacItem)
				array_push($returnData->items, array('id' => $item->name, 'type' => $item->type, 'image'=> $item->image(), 'header' => $item->header, 'question' => $item->question, 'enableOn' => $item->enableOn, 'enableOff' => $item->enableOff));
		}
	}
	
	echo json_encode($returnData);
}

?>
