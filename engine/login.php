<?php //login.php
$db_hostname = 'localhost';
$db_database = 'database';
$db_username = 'root';
$db_password = 'password';

// Connect to server.
$db_server = mysql_connect($db_hostname, $db_username, $db_password)
    or die("Unable to connect to MySQL: " . mysql_error());
	
// Select the database.
mysql_select_db($db_database)
    or die("Unable to select database: " . mysql_error());

?>