<?php
// output headers so that the file is downloaded rather than displayed
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=nmsptsa-membershipdata15.csv');

// create a file pointer connected to the output stream
$output = fopen('php://output', 'w');

// output the column headings
fputcsv($output, array('Membership Package', 'Extra Directories Requested', 'Extra Bags Requested', 'Supply Fund Donation', 'Teacher Enrichment Donation', 'Member 1', 'Grade 1', 'Role 1', 'Teacher 1', 'Member 2', 'Role 2', 'Grade 2','Teacher 2', 'Member 3', 'Role 3', 'Grade 3', 'Teacher 3', 'Member 4', 'Role 4', 'Grade 4', 'Teacher 4', 'Member 5', 'Role 5', 'Grade 5', 'Teacher 5', 'Address', 'City', 'Zip Code', 'Phone', 'Email Address', 'Gift Matching'));

// fetch the data
mysql_connect('locahost', 'root', 'password');
mysql_select_db('ptsamembership');
$rows = mysql_query('SELECT membership, directories, bags, supplyfund, enrichment, name1, role1, grade1, teacher1, name2, role2, grade2, teacher2, name3, role3, grade3, teacher3, name4, role4, grade4, teacher4, name5, role5, grade5, teacher5, address, city, zip, phone, email, giftmatching FROM form');

// loop over the rows, outputting them
while ($row = mysql_fetch_assoc($rows)) fputcsv($output, $row);
?>