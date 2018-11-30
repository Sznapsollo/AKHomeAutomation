<?php

class SensorChecker
{
	public $sensors;
	
	public function __construct() {
		$json = file_get_contents(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'configs'.DIRECTORY_SEPARATOR.'sensors.json');

		$itemsObject = json_decode($json);
		$this->sensors = $itemsObject->sensors;
    }

	public function __get($name) {
		if(property_exists($this->settings, $name))
			return $this->settings->$name;
		else 
			return null;
	}
	
	function getSensors() {
		return $this->sensors;
	}

	function checkSensor($id) {
		foreach ($this->sensors as $sensor) {
			if($sensor->id == $id)
				return $sensor;
		}
	}
}

?>
