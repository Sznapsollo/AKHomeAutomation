<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("../Class.ItemChecker.php");
require_once("Class.AdminHelpers.php");

$id = null;

if(isset($input->receive))
{
	if(isset($input->id))
		$id = $input->id;
}

if($id)
{
	$returnData = new stdClass();
	$itemChecker = new ItemChecker();
	$item = $itemChecker->checkItem($id);
	
	if($item) {
		if($item->enabled) {}
		$returnData->item = $item;
		echo json_encode($returnData);
	}
}
else
{
	$returnData = new stdClass();
	$returnData->items = array();
	$returnData->itemsDictionary = array();
	
	$itemChecker = new ItemChecker();
	$items = $itemChecker->getItems(null);

	foreach ($items as $item) {
	
		array_push($returnData->items, array('id' => $item->name, 'icon'=> $item->icon, 'image'=> $item->image, 'header' => $item->header, 'enabled' => $item->enabled));
		
		array_push($returnData->itemsDictionary, array('id' => $item->name, 'header' => $item->header));
	}
	
	$returnData->folderSecured = AdminHelpers::IsFolderSecured();

	echo json_encode($returnData);
}

?>
