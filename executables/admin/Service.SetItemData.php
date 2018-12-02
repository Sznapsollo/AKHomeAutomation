<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("../Class.ItemChecker.php");
require_once("../Class.Settings.php");
require_once("../Class.Helpers.php");

$itemChecker = new ItemChecker();
$settings = new Settings();
$itemIncoming = null;


if(isset($input->receive))
{
	if(isset($input->item)) {
		$itemIncoming = json_decode($input->item);
	}
}

if($itemIncoming && $itemIncoming->name)
{
	$filepathname = dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'configs'.DIRECTORY_SEPARATOR.'nodes.json';
	$json = file_get_contents($filepathname);
	$nodesConfig = json_decode($json);
	
	if($nodesConfig) {
		$existingItem = false;
		$index = 0;
		foreach($nodesConfig->nodes as $item) {
			if($item->name == $itemIncoming->name) {
				$swap = array($index => $itemIncoming);
				$nodesConfig->nodes = array_replace($nodesConfig->nodes, $swap);
				$item = $itemIncoming;
				$existingItem = true;
				break;
			}
			$index++;
		}
		if(!$existingItem)
			array_push($nodesConfig->nodes,$itemIncoming);
		
		file_put_contents($filepathname, json_encode($nodesConfig));
		chmod($filepathname, 0755);
	}
}
?>
