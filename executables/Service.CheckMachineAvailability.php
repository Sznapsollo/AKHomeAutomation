<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("Class.ItemChecker.php");
require_once("Class.Helpers.php");

$itemChecker = new ItemChecker();
$id = null;

if(isset($input->receive))
{
	if(isset($input->id))
		$id = $input->id;
}

if($id)
{
	$returnData = new stdClass();
	$returnData->available = false;
	
	$item = $itemChecker->checkItem($id);
	
	if($item) {
		if($item instanceof MacItem)
		{
			$command = "cat /proc/net/arp | grep ".strtolower($item->CodeOn())." | cut -d' ' -f 1";
			$ip = shell_exec($command);

			if($ip && strlen($ip) > 0)
			{
				$pingCommand = "python ./processes/./check_ping.py ".$ip;
				$pingresult = exec($pingCommand, $outcome, $status);

				if($pingresult == 0)
					$returnData->available = true;
			}
		}
	}
	echo json_encode($returnData);
}

?>
