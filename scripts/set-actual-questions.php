<?php

$data = json_decode(file_get_contents(__DIR__ . "/users/data.json"), true);
$ids = json_decode(file_get_contents(__DIR__ . "/discussion-mapping.json"), true);
// $tags = $data['amazon']['aws-certified-solutions-architect-associate-saa-c02']['tags'];

// foreach ($data['amazon']['aws-certified-solutions-architect-associate-saa-c02']['tags'] as $oid => $tags) {
//     $id = $ids[$oid];
//     if (file_exists(__DIR__ . "/discussions/actual/$id.json")) {
//         $data['amazon']['aws-certified-solutions-architect-associate-saa-c02']['tags'][$oid][] = "Actual";
//     }
// }

foreach ($ids as $oid => $id) {
    if (file_exists(__DIR__ . "/discussions/actual/$id.json")) {
        echo "\n111----------------------------------".$oid;
        if (
            !$data['amazon']['aws-certified-solutions-architect-associate-saa-c02']['tags'][$oid] || 
            !in_array("Actual", $data['amazon']['aws-certified-solutions-architect-associate-saa-c02']['tags'][$oid])
        ) {
            echo "\n\n222----------------------------------".$oid;
            if (!$data['amazon']['aws-certified-solutions-architect-associate-saa-c02']['tags'][$oid]) {
                $data['amazon']['aws-certified-solutions-architect-associate-saa-c02']['tags'][$oid] = [];
            }
            $data['amazon']['aws-certified-solutions-architect-associate-saa-c02']['tags'][$oid][] = "Actual";
        }
    }
}

// echo print_r($data, true);

file_put_contents(__DIR__ . "/users/data2.json", json_encode($data, JSON_PRETTY_PRINT));

exit;

?>