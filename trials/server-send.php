<?php
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");

$lastId = $_SERVER["HTTP_LAST_EVENT_ID"];
if (isset($lastId) && !empty($lastId) && is_numeric($lastId)) {
    $lastId = intval($lastId);
    $lastId++;
}

while (true) {
    $data = \\ query DB or any other source - consider $lastId to avoid sending same data twice
    if ($data) {
        sendMessage($lastId, $data);
        $lastId++;
    }
    sleep(2);
}

function sendMessage($id, $data) {
    echo "id: $id\n";
    echo "data: $data\n\n";
    ob_flush();
    flush();
}
?>