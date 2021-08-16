<?php

$ids = json_decode(file_get_contents(__DIR__ . "/discussion-mapping.json"));

foreach ($ids as $oid => $id) {
    $json = json_decode(file_get_contents(__DIR__ . "/discussions/parsed/$id.json"));
    if ($json) {
        foreach ($json as $comment) {
            $text = $comment->text;
            $text = str_replace("exampl", "exxampl", $text);
            $pos = strpos($text, 'exam');
            if ($pos > 0) {
                $pos = $pos > 30 ? $pos-30 : 0;
                $suf = "\n\n\n" . substr($comment->text, $pos, 80);
                $suf = str_replace("exam", "EXAM", $suf);
                if (file_exists(__DIR__ . "/discussions/actual/$id.json")) {
                    // file_put_contents(__DIR__ . "/discussions/actual/$id.$pos.json", $comment->text . $suf);
                } else {
                    file_put_contents(__DIR__ . "/discussions/actual/$id.json", $comment->text . $suf);
                }
                // echo $id;
                // echo "\n";
                // echo $comment->text;
                // echo "\n";
                // echo "\n";            
            }
        }
    }
}


exit;

?>