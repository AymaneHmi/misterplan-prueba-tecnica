<?php

$server = "127.0.0.1";
$user = "root";
$password = "root";
$db_name = "preuba";

$conn = mysqli_connect($server, $user, $password, $db_name);

if (!$conn) {
    die('Could not connect');
}