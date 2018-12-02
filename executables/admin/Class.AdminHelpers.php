<?php

class AdminHelpers
{
	public static function IsFolderSecured()
	{
		if(file_exists(dirname(__FILE__).DIRECTORY_SEPARATOR.'.htaccess'))
			return true;
		return false;
	}

}
?>
