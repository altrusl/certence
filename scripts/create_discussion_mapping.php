<?php

// include(__DIR__ . "/simple_html_dom.php");


// $id = 690441;

$ids = [];


foreach (glob(__DIR__ . "/discussions/short/" . "*.html") as $filename) {
    
    $id = basename($filename, ".html");
    $data = file_get_contents(__DIR__ . "/discussions/short/$id.html");
    // echo $id . "\n";
    $start = strpos($data, 'data-discussion-id') + 20;
    $ids[$id] = substr($data, $start, 5);
}

file_put_contents(__DIR__ . "/discussion-mapping.json", json_encode($ids, JSON_PRETTY_PRINT));
exit;

?>