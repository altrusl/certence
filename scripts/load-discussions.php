<?php

// include(__DIR__ . "/simple_html_dom.php");


// $id = 690441;

$ids = [];

for ($id=690441; $id < 690898; $id++) { 
// for ($id=690891; $id < 690920; $id++) { 
// for ($id=690645; $id < 690647; $id++) { 

    if(file_exists(__DIR__ . "/discussions/short/$id.html")) {
        $data = file_get_contents(__DIR__ . "/discussions/short/$id.html");
    } else {
        
        $url="https://www.examtopics.com/ajax/discussion/exam-question/" . $id . "/";
        $agent= 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        // curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, $agent);
        curl_setopt($ch, CURLOPT_URL, $url);
        $data = curl_exec($ch);

    }
    
    // echo $data;

    $start = strpos($data, 'data-discussion-id') + 20;

    // echo substr($data, 0, 500);
    // file_put_contents(__DIR__ . "/discussions/short/$id.html", $data);
    
    $ids[$id] = substr($data, $start, 5);
    echo $id . "-" . $ids[$id] . "\n";
    // if (!is_numeric($ids[$id])) {
    //     sleep(20);
    //     $id--;
    //     continue;
    // } else {
    //     sleep(5);
    //     loadFullDiscussion($ids[$id], $id);
    // }    
    // echo $id . "\n";
}

// file_put_contents(__DIR__ . "/discussion-mapping.json", json_encode($ids, JSON_PRETTY_PRINT));

function loadFullDiscussion($id, $oid) {
    if(file_exists(__DIR__ . "/discussions/full/$id.html")) {
        return;
    }
    $url="https://www.examtopics.com/ajax/discussion/load-complete/?discussion-id=" . $id;
    $agent= 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch, CURLOPT_VERBOSE, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, $agent);
    curl_setopt($ch, CURLOPT_URL, $url);
    do {
        sleep(6);
        $data = curl_exec($ch);
    } while (strpos($data, "<title>ExamTopics - Error</title>") > 0);

    file_put_contents(__DIR__ . "/discussions/full/$id.html", $data);

    $cs = explode('class="media comment-container"', $data);
    $comments = [];
    
    foreach ($cs as $cc) {
        if ($d = collectCommentDataRegExp($cc)) {
            $comments[] = $d;
        }
    }

    file_put_contents(__DIR__ . "/discussions/parsed/$id.json", json_encode(
        $comments, 
        JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    ));
}

// readfile($discDir . $_GET['id'] . ".json");
// exit;


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


exit;

?>