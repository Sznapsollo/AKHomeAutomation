<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("Class.ItemChecker.php");
require_once("Class.Settings.php");

$itemChecker = new ItemChecker();
$settings = new Settings();

$id = null;

if(isset($input->receive))
{
	if(isset($input->id))
		$id = $input->id;
}

$infoText = "";

if($id)
{
	$item = $itemChecker->checkItem($id);	
	
	$filepathname = $settings->regularactionfilesPath.$id.'_regular_action.json';	
		
	if (file_exists($filepathname)) { $infoText = file_get_contents($filepathname); }
}


echo $infoText;

?>
