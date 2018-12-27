<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("Class.ItemChecker.php");
require_once("Class.Settings.php");
require_once("Class.Helpers.php");

$itemChecker = new ItemChecker();
$settings = new Settings();
$id = null;
$timeLine = null;

if(isset($input->receive))
{
	if(isset($input->id))
		$id = $input->id;
		
	if(isset($input->timeLine))
		$timeLine = $input->timeLine;
}

if($id)
{
	$item = $itemChecker->checkItem($id);

	if(!Helpers::MakeDir($settings->regularactionfilesPath))
		return "No regularactionfiles dir";
	
	$filepathname = $settings->regularactionfilesPath.$item->name.'_regular_action.json';

	if($timeLine)
	{
		$timeUnits = explode("|",$timeLine);
		
		$index = 0;
		$timesArray = array();
		
		foreach($timeUnits as $timeUnitLine)
		{
			$timeUnitData = explode("#", $timeUnitLine);
			if(count($timeUnitData) < 3)
				continue;
			
			$timeUnit = new stdClass();
			$timeUnit->timeStart = $timeUnitData[0];
			$timeUnit->timeEnd = $timeUnitData[1];
			$timeUnit->daysOfWeek = $timeUnitData[2];
			
			if(count($timeUnitData) > 3)
			{
				$timeUnit->random = Helpers::ToBoolean($timeUnitData[3]);
			}
			array_push($timesArray, $timeUnit);
		}
		
		$regularActionData = json_encode(array('name' => $item->name, 'timeUnits' => $timesArray, 'delay' => $item->delay));
			
		file_put_contents($filepathname, $regularActionData);

		chmod($filepathname, 0755);
	}
	else
	{
		if (file_exists($filepathname))
			unlink($filepathname);
	}
}
?>
