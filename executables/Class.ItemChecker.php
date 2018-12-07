<?php

class SendMethod
{
	const StandardRadioSignal = 0;
	const ConradRadioSignal = 1;
	const WebAddressSignal = 2;
	const MacAddressSignal = 3;
	const ShellSignal = 4;
	const GroupItem = 5;
}

class ItemChecker
{
	public $nodes;
	
	function nodesFileName() {
		return 'nodes.json';
	}
	
	public function __construct() {
	
		$json = file_get_contents(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'configs'.DIRECTORY_SEPARATOR.$this->nodesFileName());
		$itemsObject = json_decode($json);
	
        $this->nodes = array();
	
		foreach($itemsObject->nodes as $node) 
		{
			if(property_exists($node, "sendOption") && ($node->sendOption == SendMethod::StandardRadioSignal || $node->sendOption == SendMethod::ConradRadioSignal))
				array_push($this->nodes, new IntItem($node));
			else if(property_exists($node, "sendOption") && ($node->sendOption == SendMethod::WebAddressSignal))
				array_push($this->nodes, new WebItem($node));
			else if(property_exists($node, "sendOption") && ($node->sendOption == SendMethod::MacAddressSignal))
				array_push($this->nodes, new MacItem($node));
			else if(property_exists($node, "sendOption") && ($node->sendOption == SendMethod::ShellSignal))
				array_push($this->nodes, new ShellItem($node));
			else if((property_exists($node, "sendOption") && ($node->sendOption == SendMethod::GroupItem)) || (property_exists($node, "itemIDs") && ($node->itemIDs)))
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
	
	function getItemHeaders($ids) {
		$itemHeaders = array();
		foreach ($this->nodes as $node) {
			if (in_array($node->name, $ids)) {
				array_push($itemHeaders, $node->header);
			}
		}
		return $itemHeaders;
	}
}

class BaseItem
{
	public $properties;
	
	public function __get($name) {
		if($name == 'enabled') {
			if(!property_exists($this->properties, $name)) {
				$this->properties->$name = true;
			}
		}
	
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
