<?php 

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Credentials: true');

$data = file_get_contents('php://input');
file_put_contents('data.json', $data);

?>