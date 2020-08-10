<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");

$data = json_decode(file_get_contents('php://input'));

$certProviders = json_decode(file_get_contents(__DIR__ . "/cert-providers.json"), true);
$data->certProvider = $certProviders[$data->certProviderSlug];



?>

done