<?php //data.php
require_once 'login.php'; 
	
// Get values from form
$membership       = $_POST['f_1'];
$directories       = $_POST['f_10'];
$bags       = $_POST['f_11'];
$supplyfund       = $_POST['f_9'];
$enrichment      = $_POST['f_8'];

$name1      = $_POST['name1'];
$role1      = $_POST['role1'];
$grade1      = $_POST['grade1'];
$teacher1      = $_POST['teacher1'];

$name2      = $_POST['name2'];
$role2      = $_POST['role2'];
$grade2      = $_POST['grade2'];
$teacher2      = $_POST['teacher2'];

$name3      = $_POST['name3'];
$role3      = $_POST['role3'];
$grade3      = $_POST['grade3'];
$teacher3      = $_POST['teacher3'];

$name4      = $_POST['name4'];
$role4      = $_POST['role4'];
$grade4      = $_POST['grade4'];
$teacher4      = $_POST['teacher4'];

$name5      = $_POST['name5'];
$role5      = $_POST['role5'];
$grade5     = $_POST['grade5'];
$teacher5      = $_POST['teacher5'];

$giftmatching      = $_POST['giftmatching'];

$address      = $_POST['address'];
$city     = $_POST['city'];
$zip     = $_POST['zip'];
$phone      = $_POST['phone'];
$email     = $_POST['email'];

// Insert data into mysql
$sql="INSERT INTO form (membership, directories, bags, supplyfund, enrichment, name1, role1, grade1, teacher1, name2, role2, grade2, teacher2, name3, role3, grade3, teacher3, name4, role4, grade4, teacher4, name5, role5, grade5, teacher5, address, city, zip, phone, email, giftmatching)
VALUES ('$membership','$directories','$bags','$supplyfund','$enrichment', '$name1', '$role1', '$grade1', '$teacher1', '$name2', '$role2', '$grade2', '$teacher2', '$name3', '$role3', '$grade3', '$teacher3', '$name4', '$role4', '$grade4', '$teacher4', '$name5', '$role5', '$grade5', '$teacher5', '$address', '$city', '$zip', '$phone', '$email', '$giftmatching')";
$result = mysql_query($sql); 

// if successfully insert data into database, displays message "Successful".
if($result){
header('Location: http://nmsptsa.com/ptsa-board-members/presidents-message/');
}
else {
echo "ERROR";
}

// close mysql
mysql_close();
?> 