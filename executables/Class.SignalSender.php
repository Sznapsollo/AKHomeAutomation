<?php

class SignalSender
{
	public $settings;

	public function __construct($settings) {
        $this->settings = $settings;
    }
	
	function turnComputerOn($macaddress)
	{
		$this->runShellCommand('sudo wakeonlan '.$macaddress, false);
	}

	function killDelayProcess($name)
	{
		$this->runShellCommand($this->settings->sudo.$this->settings->mainPath.'executables'.DIRECTORY_SEPARATOR."processes".DIRECTORY_SEPARATOR."./process_kill.py ".$name, false);
		$this->deleteDelayFile($name);
	}

	function disablePostProcessing($name, $seconds, $action)
	{
		$this->runShellCommand($this->settings->sudo.$this->settings->mainPath.'executables'.DIRECTORY_SEPARATOR."processes".DIRECTORY_SEPARATOR."./disable_post_processing.py ".$name." ".$seconds." ".$action, false);
	}
	
	function delayProcess($item, $seconds, $action)
	{
		$this->killDelayProcess($item->name);

		$delayedActionPath = $this->settings->sudo.$this->settings->mainPath.'executables'.DIRECTORY_SEPARATOR."processes".DIRECTORY_SEPARATOR."./delayed_action.py";

		$this->saveDelayFile($item->name, $seconds);
		
		return $delayedActionPath." ".$item->name." ".$seconds." ".$action." ".$item->processingStatus;
	}

	function radioItemScriptPath($item)
	{
		$runRadioSwitchPath = $this->settings->mainPath.'executables'.DIRECTORY_SEPARATOR."processes".DIRECTORY_SEPARATOR."./run_radio_switch.py ";
		
		if($item->sendOption == SendMethod::StandardRadioSignal)
			return $this->settings->sudo.$runRadioSwitchPath.$this->settings->codeSendPath;
		if($item->sendOption == SendMethod::ConradRadioSignal)
			return $this->settings->sudo.$runRadioSwitchPath.$this->settings->conradCodeSendPath;
	}
	
	function enableRadioItem($item, $outletDelayed, &$additionalActions)
	{
		foreach ($item->codeOn as $code) {
			$this->runShellCommand($this->radioItemScriptPath($item) ." ". $code);
		}
	
		$this->itemDelaySetUp($item, $outletDelayed, $additionalActions);
	}
	
	function disableRadioItem($item)
	{
		$this->killDelayProcess($item->name);
		
		$this->runShellCommand($this->radioItemScriptPath($item) ." ". $item->codeOff);
		
		$this->disablePostProcessing($item->name, 0, "off");
	}
	
	function delayedDisableRadioItem($item, $outletDelayed, &$additionalActions)
	{
		$this->itemDelaySetUp($item, $outletDelayed, $additionalActions);
	}
	
	function enableWebItem($item, $outletDelayed, &$additionalActions)
	{
		foreach ($item->codeOn as $code) {
			$page = Helpers::GetWebpageContent($item->UrlWithCode($code));
		}
	
		$this->itemDelaySetUp($item, $outletDelayed, $additionalActions);
	}
	
	function disableWebItem($item)
	{
		$this->killDelayProcess($item->name);
		
		$page = file_get_contents($item->CodeOff());
		
		$this->disablePostProcessing($item->name, 0, "off");
	}

	function enableShellItem($item, $outletDelayed, &$additionalActions)
	{
		foreach ($item->codeOn as $code) {
			$this->runShellCommand($code);
		}
	
		$this->itemDelaySetUp($item, $outletDelayed, $additionalActions);
	}
	
	function disableShellItem($item)
	{
		$this->killDelayProcess($item->name);
		
		$this->runShellCommand($item->codeOff);
		
		$this->disablePostProcessing($item->name, 0, "off");
	}

	function delayedDisableWebItem($item, $outletDelayed, &$additionalActions)
	{
		$this->itemDelaySetUp($item, $outletDelayed, $additionalActions);
	}
	
	function itemDelaySetUp($item, $outletDelayed, &$additionalActions)
	{
		// run additional action
		$defaultDelay = $item->delay;
	
		if($outletDelayed != 0)
			$defaultDelay = $outletDelayed;
		
		array_push($additionalActions, $this->delayProcess($item,$defaultDelay,"\"codeOff\""));
	}
	
	function runActions($actions)
	{
		$shellScripts = "";
		//$i = 0;
		foreach ($actions as $action) {
			// this has a drawback when run in a loop scripts will be dependent and next will fire when previous ended
			//$shellScripts=$shellScripts.$action.";";
			
			//$shellScripts=$shellScripts."python -c \"import sys, os, time; time.sleep(".$i."); os.system('".$action."')\""." & ";
			//$i = $i + 2;
			
			// this after introducing run_radio_switch. run all simultanously(&) but locking in (run_radio_switch) will make calls to radio switch work properly, sleep is no longer needed
			$shellScripts=$shellScripts.$action." & ";
		}
		
		if(strlen($shellScripts) > 0)
			$this->runShellCommand($shellScripts, false);
	}
	
	function runShellCommand($command, $sleep = true)
	{
		shell_exec($command);
		
		if($sleep)
			sleep(1);
	}
	
	function deleteDelayFile($name)
	{
		$filepathname = $this->settings->delayfilesPath.$name.'.json';	
		
		if (file_exists($filepathname))
			unlink($filepathname);
	}
	
	function saveDelayFile($name, $delay)
	{
		if(!($delay > 0))
			return;
	
		if(!Helpers::MakeDir($this->settings->delayfilesPath))
			return "No delayfiles dir";
	
		$filepathname = $this->settings->delayfilesPath.$name.'.json';	
		
		if (!file_exists($filepathname)) { file_put_contents($filepathname, ''); }
		
		$delayInfoText = file_get_contents($filepathname);   
		$delayInfoObject = json_decode($delayInfoText,true);
		
		$delayInfoObject["delay"] = $delay; 
		$delayInfoObject["time"] = time(); 
			
		$delayInfoText = json_encode($delayInfoObject);  
		file_put_contents($filepathname, $delayInfoText);
	}
	
}

?>
