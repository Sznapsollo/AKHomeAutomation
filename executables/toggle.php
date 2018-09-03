<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("Class.SignalSender.php");
require_once("Class.ItemChecker.php");
require_once("Class.Settings.php");
require_once("Class.Helpers.php");

$itemChecker = new ItemChecker();
$settings = new Settings();
$signalSender = new SignalSender($settings);

$outletLight = $_POST['outletId'];
$outletStatus = $_POST['outletStatus'];
$outletDelayed = $_POST['outletDelayed'];

$additionalActions = array();

function enableItem($signalSender, $item, $outletDelayed, &$additionalActions)
{	
	if($item instanceof WebItem)
		$signalSender->enableWebItem($item, $outletDelayed, $additionalActions);
	else if($item instanceof IntItem)
		$signalSender->enableRadioItem($item, $outletDelayed, $additionalActions);
}

function disableItem($signalSender, $item)
{
	if($item instanceof WebItem)
		$signalSender->disableWebItem($item);
	else if($item instanceof IntItem)
		$signalSender->disableRadioItem($item);
}

function delayedDisableItem($signalSender, $item, $outletDelayed, &$additionalActions)
{
	if($item instanceof WebItem)
		$signalSender->delayedDisableWebItem($item, $outletDelayed, $additionalActions);
	else if($item instanceof IntItem)
		$signalSender->delayedDisableRadioItem($item, $outletDelayed, $additionalActions);
}

if ($outletLight == "666" && $outletStatus == "off") {
    $signalSender->runShellCommand("sudo poweroff");
}
else if ($outletLight == "667" && $outletStatus == "off") {
    $signalSender->runShellCommand("sudo reboot");
}
else if($outletLight)
{
	$itemToProcess = $itemChecker->checkItem($outletLight);
	if($itemToProcess != null) {
		$itemToProcess->processingStatus = $outletStatus;
		if($outletStatus == "on") {
			if($itemToProcess instanceof GroupItem) {
				foreach ($itemToProcess->itemIDs as $code) {
					$subItemToProcess = $itemChecker->checkItem($code);
					if($subItemToProcess) {
						enableItem($signalSender, $subItemToProcess, $outletDelayed, $additionalActions);
						sleep(1);
					}
				}
			}
			else if($itemToProcess instanceof IntItem) {
				enableItem($signalSender, $itemToProcess, $outletDelayed, $additionalActions);
			}
			else if($itemToProcess instanceof MacItem) {
				$signalSender->turnComputerOn($itemToProcess->CodeOn()); 
			}
		}
		else if ($outletStatus == "off") {
			if($itemToProcess instanceof GroupItem) {
				foreach ($itemToProcess->itemIDs as $code) {
					$subItemToProcess = $itemChecker->checkItem($code);
					if($subItemToProcess)
						disableItem($signalSender, $subItemToProcess);
						sleep(1);
				}
			}
			else if($itemToProcess instanceof IntItem) {
				disableItem($signalSender, $itemToProcess);
			}
		}
		else if($outletStatus == "offd") {
			if($itemToProcess instanceof IntItem) {
				delayedDisableItem($signalSender, $itemToProcess, $outletDelayed, $additionalActions);
			}
		}
	}
}

$signalSender->runActions($additionalActions);

echo json_encode(array('success' => true));
?>
