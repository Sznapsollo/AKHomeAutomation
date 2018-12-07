<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("Class.ItemChecker.php");
require_once("Class.SensorChecker.php");
require_once("Class.Settings.php");

$category = null;

if(isset($input->receive))
{
	if(isset($input->category))
		$category = $input->category;
}

if($category)
{
	$settings = new Settings();
	$itemChecker = new ItemChecker();
	$items = array();
	
	$returnData = new stdClass();
	$returnData->items = array();
	
	if($category == 'sensors')
	{
		$sensorChecker = new SensorChecker();
		$items = $sensorChecker->getSensors();

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
		$itemChecker = new ItemChecker();
		$items = $itemChecker->getItems($category);
	
		foreach ($items as $item) {
		
			$defaultDelayValue = $item->delay ? ($item->delay < 0 ? -1 :ceil($item->delay/60)) : null;
			if($item instanceof IntItem)
			{
				array_push($returnData->items, array('id' => $item->name, 'hotword' => $item->hotword, 'icon'=> $item->icon, 'image'=> $item->image, 'delay' => $defaultDelayValue, 'header' => $item->header, 'questionOff' => $item->questionOff, 'questionOn' => $item->questionOn, 'enableOn' => $item->enableOn, 'enableOff' => $item->enableOff, 'regularActions' => $item->regularActions, 'subtype' => "I", 'enabled' => $item->enabled));
			}
			else if($item instanceof GroupItem || $item instanceof MacItem)
			{
				$relatedItems = array();
				if($item->itemIDs) {
					$relatedItems = $itemChecker->getItemHeaders($item->itemIDs);
				}
				array_push($returnData->items, array('id' => $item->name, 'hotword' => $item->hotword, 'icon'=> $item->icon, 'image'=> $item->image, 'header' => $item->header, 'questionOff' => $item->questionOff, 'questionOn' => $item->questionOn, 'enableOn' => $item->enableOn, 'enableOff' => $item->enableOff, 'regularActions' => $item->regularActions, 'subtype' => $item instanceof MacItem ? "M" : "G", 'enabled' => $item->enabled, 'relatedItems' => $relatedItems));
			}
		}
	}
	
	echo json_encode($returnData);
}

?>
