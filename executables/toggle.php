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

$request = file_get_contents('php://input');
$input = json_decode($request);

$outletLight = isset($input->outletId) ? $input->outletId : (isset($_POST['outletId']) ? $_POST['outletId'] : null);
$outletStatus = isset($input->outletStatus) ? $input->outletStatus : (isset($_POST['outletStatus']) ? $_POST['outletStatus'] : null);
$outletDelayed = isset($input->outletDelayed) ? $input->outletDelayed : (isset($_POST['outletDelayed']) ? $_POST['outletDelayed'] : null);
$outletSource = isset($input->outletSource) ? $input->outletSource : (isset($_POST['outletSource']) ? $_POST['outletSource'] : null);

$additionalActions = array();

function enableItem($signalSender, $item, $outletDelayed, &$additionalActions)
{
	if(!$item->enabled)
		return;
		
	if($item instanceof WebItem)
		$signalSender->enableWebItem($item, $outletDelayed, $additionalActions);
	else if($item instanceof IntItem)
		$signalSender->enableRadioItem($item, $outletDelayed, $additionalActions);
	else if($item instanceof ShellItem)
		$signalSender->enableShellItem($item, $outletDelayed, $additionalActions);
}

function disableItem($signalSender, $item)
{
	if($item instanceof WebItem)
		$signalSender->disableWebItem($item);
	else if($item instanceof IntItem)
		$signalSender->disableRadioItem($item);
	else if($item instanceof ShellItem)
		$signalSender->disableShellItem($item);
}

function delayedDisableItem($signalSender, $item, $outletDelayed, &$additionalActions)
{
	if($item instanceof WebItem)
		$signalSender->delayedDisableWebItem($item, $outletDelayed, $additionalActions);
	else if($item instanceof IntItem)
		$signalSender->delayedDisableRadioItem($item, $outletDelayed, $additionalActions);
}

if($outletLight)
{
	$itemToProcess = $itemChecker->checkItem($outletLight);
	if($itemToProcess != null) {
		$itemToProcess->processingStatus = $outletStatus;
		$itemToProcess->processingSource = $outletSource ? $outletSource : "-";
		if($outletStatus == "on") {
			if($itemToProcess instanceof GroupItem) {
				foreach ($itemToProcess->itemIDs as $code) {
					$subItemToProcess = $itemChecker->checkItem($code);
					$subItemToProcess->processingStatus = $outletStatus;
					$subItemToProcess->processingSource = $outletSource ? $outletSource : "-";
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
					$subItemToProcess->processingStatus = $outletStatus;
					$subItemToProcess->processingSource = $outletSource ? $outletSource : "-";
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
