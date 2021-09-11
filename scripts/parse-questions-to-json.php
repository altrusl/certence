<?php

$ids = json_decode(file_get_contents(__DIR__ . "/discussion-mapping.json"));

foreach ($ids as $oid => $id) {
    copy(__DIR__ . "/discussions/parsed/$id.json", __DIR__ . "/discussions/short-parsed/$oid.json");    
}


exit;

?>