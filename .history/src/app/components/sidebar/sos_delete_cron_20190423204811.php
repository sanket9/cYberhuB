<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(-1);


$servername = "localhost";
$username = "arctechs_openeyez";
$password = "^Fpy@p5N{9OP";
$dbname = "arctechs_openeyez";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$sql = "SELECT * FROM `sos` WHERE `sos`.`status` = '1'";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    // output data of each row
   while ($row = $result->fetch_assoc()) {
//        echo '<pre>';
// print_r($row);
// echo '</pre>';

    $update_sql = "UPDATE `booking` SET `booking`.`status` =4 WHERE `id`=" . $row['id'];
    $conn->query($update_sql);
    
    }
 
}
?>