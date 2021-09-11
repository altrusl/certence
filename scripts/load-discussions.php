<?php

// include(__DIR__ . "/simple_html_dom.php");


// $id = 690441;

$ids = [];

// for ($id=738982; $id <= 739473; $id++) { 


// for ($id=739089; $id <= 739473; $id++) { 
// for ($id=739166; $id <= 739473; $id++) { 
for ($id=739266; $id <= 739353; $id++) { 
// for ($id=739434; $id <= 739475; $id++) { 

// for ($id=690441; $id < 690898; $id++) { 
// for ($id=690891; $id < 690920; $id++) { 
// for ($id=690645; $id < 690647; $id++) { 

    if(file_exists(__DIR__ . "/discussions/short/$id.html")) {
        $data = file_get_contents(__DIR__ . "/discussions/short/$id.html");
    } else {
        
        $url="https://www.examtopics.com/ajax/discussion/exam-question/" . $id . "/";
        // $agent= 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        // curl_setopt($ch, CURLOPT_PROXY, "localhost:1080");
        // curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // curl_setopt($ch, CURLOPT_USERAGENT, $agent);
        curl_setopt($ch, CURLOPT_URL, $url);

        curl_setopt_array($ch,array(
            CURLOPT_USERAGENT=>'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0',
            CURLOPT_ENCODING=>'gzip, deflate',
            CURLOPT_HTTPHEADER=>array(
                "accept: */*",
                "accept-language: ru,en-US;q=0.9,en;q=0.8,ru-RU;q=0.7,la;q=0.6",
                "sec-ch-ua: \"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
                "sec-ch-ua-mobile: ?0",
                "sec-ch-ua-platform: \"Windows\"",
                "sec-fetch-dest: empty",
                "sec-fetch-mode: cors",
                "sec-fetch-site: same-origin",
                "x-requested-with: XMLHttpRequest",
                "referrer: https://www.examtopics.com/exams/amazon/aws-certified-solutions-architect-associate-saa-c02/view/1/",
                "referrerPolicy: same-origin",
                "method: GET",
                "mode: cors",
                "credentials: include"
            ),
        ));

        $data = curl_exec($ch);
        file_put_contents(__DIR__ . "/discussions/short/$id.html", $data);
    }
    
    // echo $data;

    $start = strpos($data, 'data-discussion-id') + 20;
    $empty = strpos($data, 'Currently there are no comments in this discussion') > 0;

    // echo substr($data, 0, 500);
    // file_put_contents(__DIR__ . "/discussions/short/$id.html", $data);
    
    $ids[$id] = substr($data, $start, 5);
    echo $id . "-" . $ids[$id] . "\n";
    if ($empty) {
        // file_put_contents(__DIR__ . "/discussions/full/$ids[$id].html", "");
        file_put_contents(__DIR__ . "/discussions/parsed2/$id.json", "{}");
    } else if (!is_numeric($ids[$id])) {
        sleep(20);
        $id--;
        continue;
    } else {
        sleep(5);
        loadFullDiscussion($ids[$id], $id);
    }    
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
    file_put_contents(__DIR__ . "/discussions/parsed2/$oid.json", json_encode(
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