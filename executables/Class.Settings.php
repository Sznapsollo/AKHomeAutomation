<?php

class Settings
{
	public $settings;
	public $sudo;
	
	public function __construct() {
		$json = file_get_contents(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'configs'.DIRECTORY_SEPARATOR.'settings.json');
		$this->settings = json_decode($json);
		$this->sudo = "sudo ";
    }

	public function __get($name) {
		if(property_exists($this->settings, $name))
			return $this->settings->$name;
		else 
			return null;
	}
}

?>
