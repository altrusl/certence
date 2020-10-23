<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");


$examDir = __DIR__ . "/../certifications/" . $_GET['provider'] . "/" . $_GET['exam'];

if (!file_exists($examDir)) {
    echo "error";
    exit;
}

$discDir = $examDir . "/discussions/";
if (!file_exists($discDir)) {
    mkdir($discDir, 0777, true);
    chmod($discDir, 0777);
}

if (!file_exists($discDir . "/" . $_GET['id'] . '.json')) {
    // include(__DIR__ . "/simple_html_dom.php");
    
    $url="https://www.examtopics.com/ajax/discussion/exam-question/" . $_GET['id'] . "/";
    $agent= 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_VERBOSE, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, $agent);
    curl_setopt($ch, CURLOPT_URL, $url);
    $data = curl_exec($ch);

    // echo $data;
    // exit;

    // $data = file_get_contents(__DIR__ . "/discussion.html");
    
    // $data = file_get_html('https://www.examtopics.com/ajax/discussion/exam-question/442367/');
    // $data = str_get_html($data);

    $cs = explode('<div class="media comment-container"', $data);

    // preg_match('/comment-date(.*?)title="(.*?)">/sim', $cs[10], $matches);
    // print_r($matches);


    // exit;
    
    $comments = [];
    // $cs = $data->find(".comment-container");

    foreach ($cs as $cc) {
        // $comments[] = collectCommentData($cc);
        if ($d = collectCommentDataRegExp($cc)) {
            $comments[] = $d;
        }
    }

    file_put_contents($discDir . $_GET['id'] . ".json", json_encode(
        $comments, 
        JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    ));
}

readfile($discDir . $_GET['id'] . ".json");
exit;


function collectCommentDataRegExp($cc) {

    $data = [];

    preg_match('/data-comment-id="(.*?)"/sim', $cc, $matches);
    if (empty($matches)) return false;
    $data["id"] = $matches[1];
    
    preg_match('/username">(.*?)</sim', $cc, $matches);
    $data["username"] = trim($matches[1]);
    
    preg_match('/comment-date(.*?)title="(.*?)">/sim', $cc, $matches);
    $data["date"] = trim($matches[2]);
    
    preg_match('/comment-content">(.*?)</sim', $cc, $matches);
    $data["text"] = str_replace("&#39;", "'", htmlspecialchars_decode(trim($matches[1])));
    
    preg_match('/upvote-count">(.*?)</sim', $cc, $matches);
    $data["upvotes"] = trim($matches[1]);
        
    preg_match('/upvote-count">(.*?)</sim', $cc, $matches);
    $data["upvotes"] = trim($matches[1]);

    $data["level"] = 0;
    
    return $data;
}


function collectCommentData($cc) {
    $data = [];
    $data["id"] = $cc->getAttribute("data-comment-id");
    $data["username"] = trim($cc->find(".comment-username", 0)->plaintext);
    $data["date"] = $cc->find(".comment-date", 0)->getAttribute('title');
    $data["dateRel"] = trim($cc->find(".comment-date", 0)->plaintext);
    $data["text"] = htmlspecialchars_decode(trim($cc->find(".comment-content", 0)->plaintext));
    $data["upvotes"] = intval(trim($cc->find(".upvote-count", 0)->plaintext));
    $data["level"] = 0;
    $p = $cc->parent();
    while ($p->class != 'discussion-container') {
        if ($p->class == 'media comment-container') {
            $data["level"]++;
        }
        $p = $p->parent();
    }
    return $data;
}
?>