<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

$request = file_get_contents('php://input');
$input = json_decode($request);

$fileName = null;
$fileContent = null;

if(isset($input->receive)) {
	if(isset($input->fileName))
		$fileName = $input->fileName;
	
	if(isset($input->category))
		$category = $input->category;
}

if($category && $fileName && strpos($fileName, '.log')) {

	$filepathname = '../logs/'.$category.'/'.$fileName;				
	if (file_exists($filepathname)) { $fileContent = file_get_contents($filepathname); }
	
	$returnData = new stdClass();

	// for exceptions
	$returnData->loglines = explode("\n\r\n", $fileContent);

	if(count($returnData->loglines) <= 1)
		$returnData->loglines = explode("\r\n", $fileContent);
	
	echo json_encode($returnData);
}
?>
