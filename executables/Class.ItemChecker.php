<?php

class SendMethod
{
	const StandardRadioSignal = 0;
	const ConradRadioSignal = 1;
	const WebAddressSignal = 2;
	const MacAddressSignal = 3;
}

class ItemChecker
{
	public $nodes;
	
	public function __construct() {
	
		$json = file_get_contents(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'configs'.DIRECTORY_SEPARATOR.'nodes.json');
		$itemsObject = json_decode($json);
	
        $this->nodes = array();
	
		foreach($itemsObject->nodes as $node) 
		{
			if(property_exists($node, "sendOption") && ($node->sendOption == 0 || $node->sendOption == 1))
				array_push($this->nodes, new IntItem($node));
			else if(property_exists($node, "sendOption") && ($node->sendOption == 2))
				array_push($this->nodes, new WebItem($node));
			else if(property_exists($node, "sendOption") && ($node->sendOption == 3))
				array_push($this->nodes, new MacItem($node));
			else if(property_exists($node, "sendOption") && ($node->sendOption == 4))
				array_push($this->nodes, new ShellItem($node));
			else if(property_exists($node, "itemIDs") && ($node->itemIDs))
				array_push($this->nodes, new GroupItem($node));
		}
    }
	
	function getItems($category) {
		$nodes = array();
	
		foreach ($this->nodes as $item) {
			if($category)
			{
				if($item->category == $category)
					array_push($nodes, $item);
			}
			else
				array_push($nodes, $item);
		}
		
		return $nodes;
	}
	
	function checkItem($id) {
		foreach ($this->nodes as $node) {
			if($node->name == $id)
				return $node;
		}
	}
}

class BaseItem
{
	public $properties;
	public $image;
	
	public function image() {
		if(property_exists($this->properties, "image"))
			return $this->properties->image;
		else
			return null;
	}
	
	public function icon() {
		if(property_exists($this->properties, "icon"))
			return $this->properties->icon;
		else
			return null;
	}
	
	public function enabled() {
		if(!property_exists($this->properties, "enabled")) {
			$this->properties->enabled = true;
		}
		return $this->properties->enabled;
	}
	
	public function __get($name) {
		if(property_exists($this->properties, $name))
			return $this->properties->$name;
		else 
			return null;
	}
}

class IntItem extends BaseItem
{
    public function __construct($properties) {
        $this->properties = $properties;
    }
	
	public function CodeOn()
	{
		return $this->codeOn[0];
	}
	
	public function CodeOff()
	{
		return $this->codeOff;
	}
}

class GroupItem extends BaseItem
{
	public function __construct($properties) {
        $this->properties = $properties;
    }
}

class WebItem extends IntItem
{
	public function __construct($properties) {
        $this->properties = $properties;
    }
	
	public function UrlWithCode($code)
	{
		return $this->address."?check=1&".$code;
	}
	
	public function UrlWithCheck()
	{
		return $this->address."?check=1";
	}
	
	public function CodeOn()
	{
		return $this->UrlWithCode($this->codeOn[0]);
	}
	
	public function CodeOff()
	{
		return $this->UrlWithCode($this->codeOff);
	}
}

class MacItem extends BaseItem
{
	public function __construct($properties) {
		$this->properties = $properties;
	}
	
	public function CodeOn()
	{
		return $this->codeOn[0];
	}
}


class ShellItem extends IntItem
{
	public function __construct($properties) {
		$this->properties = $properties;
	}

}

?>
