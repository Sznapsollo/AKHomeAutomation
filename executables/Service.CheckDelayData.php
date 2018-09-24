<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("Class.ItemChecker.php");
require_once("Class.Settings.php");
require_once("Class.Helpers.php");

$itemChecker = new ItemChecker();
$settings = new Settings();
$id = null;

if(isset($input->receive))
{
	if(isset($input->id))
		$id = $input->id;
}

$delayInfoText = "";

if($id)
{
	$item = $itemChecker->checkItem($id);
	
	if($item) {
	
		if($item instanceof IntItem)
		{
			$filepathname = $settings->delayfilesPath.$id.'.json';
			
			if (file_exists($filepathname)) { $delayInfoText = file_get_contents($filepathname); }
			
			if($item instanceof WebItem)
			{
				$page = Helpers::GetWebpageContent( $item->UrlWithCheck() );
				
				$delayInfoTextObject = json_decode($delayInfoText);
				
				if($delayInfoTextObject == null ) 
					$delayInfoTextObject = new stdClass();
				
				if($page['content'] != null)
				{
					$data = json_decode($page['content']);
					$delayInfoTextObject -> enabled = $data->pin1;
				}
				else
					$delayInfoTextObject -> enabled = null;
				
				$delayInfoText = json_encode($delayInfoTextObject);
			}
		}
	}
}

echo $delayInfoText;
?>
