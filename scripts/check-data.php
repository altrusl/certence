<?php 

$d = file_get_contents(__DIR__ . "/../certifications/amazon/aws-certified-solutions-architect-associate/data.json");
$d = json_decode($d);
$i = 0;

uasort($d->questions, 'cmp');

foreach($d->questions as $dd) {
    echo $i++ . " ";
    echo $dd->questionNumber;
    echo " " . $dd->questionTopicNumber;
    echo "\n";
}

uasort($d->questions, 'cmp');


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