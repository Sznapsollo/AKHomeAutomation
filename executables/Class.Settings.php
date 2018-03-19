<?php

class Settings
{
	public $settings;
	public $sudo;
	
	public function __construct() {
	
		$json = file_get_contents(dirname(__FILE__) . '/settings.json');
		
		$this->settings = json_decode($json);
		$this->sudo = "sudo ";
    }
	
	public function __get($name) {
		return $this->settings->$name;
	}
}

?>
