<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

$request = file_get_contents('php://input');
$input = json_decode($request);

if(isset($input->service))
{
	switch($input->service) 
	{
		case "CheckDelayData":
			require_once("Service.CheckDelayData.php");
			break;
		case "GetRegularActionData":
			require_once("Service.CheckRegularActionData.php");
			break;
		case "SetRegularActionData":
			require_once("Service.SetRegularActionData.php");
			break;
		case "CheckItemsData":
			require_once("Service.CheckItemsData.php");
			break;
		case "SetSensorActionData":
			require_once("Service.SetSensorActionData.php");
			break;
		case "CheckLogsListData":
			require_once("Service.CheckLogsListData.php");
			break;
		case "CheckLogsFileData":
			require_once("Service.CheckLogsFileData.php");
			break;
		case "CheckPageData":
			require_once("Service.CheckPageData.php");
			break;
		case "CheckMachineAvailability":
			require_once("Service.CheckMachineAvailability.php");
			break;
	}
}

?>
