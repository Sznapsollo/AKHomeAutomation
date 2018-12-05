<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("../Class.ItemChecker.php");
require_once("../Class.Settings.php");
require_once("../Class.Helpers.php");

class EditProcess
{
	const EditAction = 0;
	const AddAction = 1;
	const DeleteAction = 2;
}

$itemChecker = new ItemChecker();
$settings = new Settings();
$itemIncoming = null;
$isNew = false;


if(isset($input->receive))
{
	if(isset($input->item)) {
		$itemIncoming = json_decode($input->item);
	}
}

if($itemIncoming && property_exists($itemIncoming,'name') && property_exists($itemIncoming,'header') && property_exists($itemIncoming,'category') && property_exists($itemIncoming,'__processAction'))
{
	$filepathname = dirname(dirname(dirname(__FILE__))).DIRECTORY_SEPARATOR.'configs'.DIRECTORY_SEPARATOR.$itemChecker->nodesFileName();
	$json = file_get_contents($filepathname);
	$nodesConfig = json_decode($json);
	
	if($nodesConfig) {
		
		if($itemIncoming->__processAction == EditProcess::EditAction)
		{
			unset($itemIncoming->__processAction);
			$index = 0;
			foreach($nodesConfig->nodes as $item) {
				if($item->name == $itemIncoming->name) {
					$swap = array($index => $itemIncoming);
					$nodesConfig->nodes = array_replace($nodesConfig->nodes, $swap);
					$item = $itemIncoming;
					reorderNodes($index, $nodesConfig->nodes);
					break;
				}
				$index++;
			}
		}
		else if($itemIncoming->__processAction == EditProcess::AddAction)
		{
			unset($itemIncoming->__processAction);
			array_push($nodesConfig->nodes,$itemIncoming);
			reorderNodes(count($nodesConfig->nodes)-1, $nodesConfig->nodes);
		}
		else if($itemIncoming->__processAction == EditProcess::DeleteAction)
		{
			$index = 0;
			foreach($nodesConfig->nodes as $item) {
				if($item->name == $itemIncoming->name) {
					array_splice($nodesConfig->nodes, $index, 1);
					break;
				}
				$index++;
			}
		}
		
		file_put_contents($filepathname, json_encode($nodesConfig));
		chmod($filepathname, 0755);
	}
}

function reorderNodes($index, &$nodes) {
	$node = $nodes[$index];
	if(!property_exists($node,'__reorder'))
		return;
		
	if($node->__reorder == -1 && $index != 0) {
		// first
		unset($node->__reorder);
		array_splice($nodes, $index, 1);
		array_unshift($nodes, $node);
	}
	else if($node->__reorder == 99) {
		unset($node->__reorder);
		array_splice($nodes, $index, 1);
		array_push($nodes, $node);
	}
	else {
		// after something
		$indexAfter = 0;
		foreach($nodes as $item) {
			if($item->name == $node->__reorder) {
				break;
			}
			$indexAfter++;
		}
		
		if($indexAfter != $index) {
			$indexAfter++;
			array_splice($nodes, $index, 1);
			if($indexAfter > $index)
				$indexAfter--;
			
			unset($node->__reorder);
			array_splice($nodes, $indexAfter, 0, array($node));
		}
	}
}

?>
