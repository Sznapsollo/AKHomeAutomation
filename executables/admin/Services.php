<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

$request = file_get_contents('php://input');
$input = json_decode($request);

if(isset($input->service))
{
	switch($input->service) 
	{
		case "CheckSensorAlarmData":
			require_once("Service.CheckSensorAlarmData.php");
			break;
		case "SetSensorAlarmData":
			require_once("Service.SetSensorAlarmData.php");
			break;
		case "CheckItemsData":
			require_once("Service.CheckItemsData.php");
			break;
		case "SetItemData":
			require_once("Service.SetItemData.php");
			break;
	}
}

?>
