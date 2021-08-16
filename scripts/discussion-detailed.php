<?php

// $examDir = __DIR__ . "/../certifications/" . $_GET['provider'] . "/" . $_GET['exam'];

$data = file_get_contents(__DIR__ . 'discussion-mapping.json');
$data = json_decode($data);
$data = array_values($data);

foreach ($data as $id) {
    
    $url="https://www.examtopics.com/ajax/discussion/load-complete/?discussion-id=" . $id;
    $agent= 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_VERBOSE, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, $agent);
    curl_setopt($ch, CURLOPT_URL, $url);
    $data = curl_exec($ch);

    $cs = explode('class="media comment-container"', $data);
    $comments = [];
    
    foreach ($cs as $cc) {
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
    $data["text"] = str_replace("&#x27;", "'", $data["text"]);
    
    preg_match('/upvote-count">(.*?)</sim', $cc, $matches);
    $data["upvotes"] = trim($matches[1]);
        
    preg_match('/upvote-count">(.*?)</sim', $cc, $matches);
    $data["upvotes"] = trim($matches[1]);

    $data["level"] = 0;
    
    return $data;
}

?>