<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

require_once("Class.Settings.php");

$request = file_get_contents('php://input');
$input = json_decode($request);

$startIndex = 5;
$itemsPerPage = 10;

if(isset($input->receive)) {
	if(isset($input->startIndex) && is_numeric($input->startIndex))
		$startIndex = $input->startIndex;
	
	if(isset($input->itemsPerPage) && is_numeric($input->itemsPerPage))
		$itemsPerPage = $input->itemsPerPage;

	if(isset($input->category))
		$category = $input->category;
}

if($category) {

	$settings = new Settings();

	$fileTypes = 'log';
	$files = array();
	
	$dir = '../logs/'.$category;
	if (is_dir($dir)) {
		$dir = opendir($dir); 
		while(false != ($file = readdir($dir))) {
			if (!is_dir($file) && $file != "." && $file != "..") {		
				$ext = pathinfo($file, PATHINFO_EXTENSION);
				$file_ext = explode(',',str_replace(' ', '', $fileTypes));

				if(in_array(strtolower($ext),$file_ext)) {
					$files[] = $file;
				}			
			}
		}
	
		rsort($files);
	}
	
	$index = 0;
	$count = 0;
	$returnFiles = array();

	foreach($files as $file) 
	{
			if($index >= $startIndex && $count < $itemsPerPage)
			{
				$fileInfo = new StdClass();
				$fileInfo->name = $file;
				$returnFiles[] = $fileInfo;
				$count++;
			}
			$index++;
	}
	
	$returnData = new stdClass();
	$returnData->items = $returnFiles;
	$returnData->allCount = count($files);
	$returnData->translations = $settings->translations;
	
	echo json_encode($returnData);
}
?>
