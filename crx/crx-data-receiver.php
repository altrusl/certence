<?php
header("Access-Control-Allow-Origin: *");

$data = json_decode(file_get_contents('php://input'));

$certProviders = json_decode(file_get_contents(__DIR__ . "/cert-providers.json"), true);
$data->certProvider = $certProviders[$data->certProviderSlug];

$examDir = __DIR__ . "/certifications/" . $data->certProviderSlug . "/" . $data->examSlug;
$questionDir = $examDir . "/questions/";

if (!file_exists($questionDir)) {
    mkdir($questionDir, 0777, true);
}

foreach($data->questions as $question) {
    file_put_contents($questionDir . $question->id . ".json", 
        json_encode($question, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
}

unset($data->questions);

file_put_contents($examDir . "/certification.json", 
    json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));


if (file_exists(__DIR__ . "/certifications.json")) {
    $certs = json_decode(file_get_contents(__DIR__ . "/certifications.json"), true);    
} else {
    $certs = [];
}

$certs[$data->examSlug] = $data;

file_put_contents(__DIR__ . "/certifications.json", 
    json_encode($certs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));


$d = [];
foreach (glob($questionDir . "*.json") as $filename) {
    $d[] = json_decode(file_get_contents($filename));
}

$data->questions = $d;
    
file_put_contents($examDir . "/data.json", 
    json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));


// file_put_contents(__DIR__ . "/dd.json", "asas");
// echo print_r($data);

?>

done