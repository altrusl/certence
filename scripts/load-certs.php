<?php

$providers = json_decode(file_get_contents(__DIR__ . "/cert-providers-objects.json"), FALSE);
include(__DIR__ . "/simple_html_dom.php");

$ps = [];

foreach($providers as $provider) {
    // echo $provider->provider;
    // $url="https://www.examtopics.com/exams/amazon/";
    // $url="https://www.examtopics.com/exams/microsoft/";
    $url="https://www.examtopics.com/exams/" . $provider->provider . "/";
    $agent= 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_VERBOSE, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, $agent);
    curl_setopt($ch, CURLOPT_URL, $url);
    $data = curl_exec($ch);

    $data = str_get_html($data);

    $ll = $data->find(".exam-list-font li a");

    $ps[$provider->provider] = [];

    
    foreach ($ll as $l) {        
        $cert = [];
        $h = explode("/", $l->href);
        // echo "\n";
        // echo $h[3];
        $cert["slug"] = $h[3];
        // echo "\n";
        $code = $l->find(".popular-exam-code", 0)->plaintext;
        $len = strlen($code);
        $code = substr($code, 0, $len - 2);
        // echo $code;
        $cert["code"] = $code;
        // echo "\n";
        // echo trim(substr($l->plaintext, $len));
        $cert["title"] = trim(substr($l->plaintext, $len));
        // echo "\n";
        $certs[] = $cert;
    }

    $ps[$provider->provider] = $certs;
    
    
    // break;
}


file_put_contents(__DIR__ . "/certs.json", 
    json_encode($ps, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

exit;

?>