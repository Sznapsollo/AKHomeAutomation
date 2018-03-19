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

$request = file_get_contents('php://input');
$input = json_decode($request);

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
