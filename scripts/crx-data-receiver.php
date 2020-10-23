<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

$data = json_decode(file_get_contents('php://input'));

$certProviders = json_decode(file_get_contents(__DIR__ . "/cert-providers.json"), true);
$data->certProvider = $certProviders[$data->certProviderSlug];
if (!$data->certProvider) exit;

$examDir = __DIR__ . "/../certifications/" . $data->certProviderSlug . "/" . $data->examSlug;
$questionDir = $examDir . "/questions/";

// if (!file_exists(__DIR__ . "/../certifications/")) {
//     mkdir(__DIR__ . "/../certifications/", 0777, true);
// }
// if (!file_exists(__DIR__ . "/../certifications/" . $data->certProviderSlug)) {
//     mkdir(__DIR__ . "/../certifications/" . $data->certProviderSlug, 0777, true);
// }
// if (!file_exists($examDir)) {
//     mkdir($examDir, 0777, true);
// }
if (!file_exists($questionDir)) {
    mkdir($questionDir, 0777, true);
}
chmod(__DIR__ . "/../certifications/", 0777);
chmod(__DIR__ . "/../certifications/" . $data->certProviderSlug, 0777);
chmod($examDir, 0777);
chmod($questionDir, 0777);

foreach($data->questions as $question) {
    file_put_contents($questionDir . $question->id . ".json", 
        json_encode($question, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    chmod($questionDir . $question->id . ".json", 0666);
}

unset($data->questions);

file_put_contents($examDir . "/certification.json", 
    json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
chmod($examDir . "/certification.json", 0666);


if (file_exists(__DIR__ . "/../certifications.json")) {
    $certs = json_decode(file_get_contents(__DIR__ . "/../certifications.json"), true);    
} else {
    $certs = [];
}

$duplicate = false;
for ($i=0; $i < count($certs); $i++) { 
    if ($certs[$i]["certProviderSlug"] == $data->certProviderSlug &&
        $certs[$i]["examSlug"] == $data->examSlug) {
        $certs[$i] = $data;
        $duplicate = true;
        break;
    }
}
if (!$duplicate) {
    $certs[] = $data;
}

file_put_contents(__DIR__ . "/../certifications.json", 
    json_encode($certs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
chmod(__DIR__ . "/../certifications.json", 0666);


$d = [];
foreach (glob($questionDir . "*.json") as $filename) {
    $d[] = json_decode(file_get_contents($filename));
}

uasort($d, 'cmp');
print_r($data);
$data->questions = array_values($d);

    
file_put_contents($examDir . "/data.json", 
    json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
chmod($examDir . "/data.json", 0666);


// file_put_contents(__DIR__ . "/dd.json", "asas");
// echo print_r($data);

function cmp($a, $b) {
    if ($a->questionTopicNumber < $b->questionTopicNumber) {
        return -1;
    } else if ($a->questionTopicNumber > $b->questionTopicNumber) {
        return 1;
    } else {
        if ($a->questionNumber < $b->questionNumber ) {
            return -1;
        } else if ($a->questionNumber > $b->questionNumber ) {
            return 1;
        }
    }
    return 0;
}

?>

done