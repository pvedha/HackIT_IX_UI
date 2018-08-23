<?php
// This our simple data source. Usually we should query database, or some other data stream.
// Here we have one multidimensional array with very simple structure - ticked -> price.
// Server sends those data one by one until the end waiting some random time (seconds) in between.
// In real life scenario you need real data source, but for example purpose it is OK.
// Array contains 70 elements which should be enough to run demo for 1-3 minutes.
$tickets = [
	[ "GOOG", 533.37 ],
	[ "MSFT",  47.59 ],
	[ "IBM",  162.99 ],
	[ "AAPL", 114.12 ],
	[ "MSFT",  47.29 ],
	[ "GOOG", 533.95 ],
	[ "IBM",  163.78 ],
	[ "GOOG", 533.55 ],
	[ "AAPL", 113.67 ],
	[ "GOOG", 533.91 ],
	[ "MSFT",  48.12 ],
	[ "IBM",  162.37 ],
	[ "AAPL", 114.12 ],
	[ "MSFT",  48.05 ],
	[ "AAPL", 114.32 ],
	[ "GOOG", 533.97 ],
	[ "MSFT",  48.54 ],
	[ "IBM",  162.69 ],
	[ "AAPL", 114.45 ],
	[ "IBM",  162.74 ],
	[ "AAPL", 114.67 ],
	[ "GOOG", 533.97 ],
	[ "MSFT",  48.54 ],
	[ "IBM",  162.69 ],
	[ "AAPL", 114.45 ],
	[ "IBM",  162.74 ],
	[ "AAPL", 114.67 ],
	[ "GOOG", 533.67 ],
	[ "MSFT",  48.79 ],
	[ "GOOG", 534.23 ],
	[ "IBM",  162.85 ],
	[ "AAPL", 114.57 ],
	[ "IBM",  162.86 ],
	[ "AAPL", 114.83 ],
	[ "GOOG", 533.34 ],
	[ "MSFT",  48.92 ],
	[ "GOOG", 534.48 ],
	[ "IBM",  162.97 ],
	[ "AAPL", 114.70 ],
	[ "IBM",  163.12 ],
	[ "AAPL", 115.21 ],
	[ "GOOG", 534.37 ],
	[ "MSFT",  48.85 ],
	[ "IBM",  163.01 ],
	[ "AAPL", 114.98 ],
	[ "GOOG", 534.37 ],
	[ "GOOG", 534.38 ],
	[ "GOOG", 534.42 ],
	[ "MSFT",  48.85 ],
	[ "GOOG", 534.63 ],
	[ "IBM",  163.01 ],
	[ "MSFT",  48.97 ],
	[ "IBM",  163.21 ],
	[ "GOOG", 534.58 ],
	[ "MSFT",  48.93 ],
	[ "IBM",  163.13 ],
	[ "AAPL", 114.98 ],
	[ "MSFT",  48.83 ],
	[ "MSFT",  48.85 ],
	[ "AAPL", 115.22 ],
	[ "MSFT",  49.11 ],
	[ "IBM",  163.19 ],
	[ "AAPL", 115.12 ],
	[ "IBM",  163.12 ],
	[ "AAPL", 114.23 ],
	[ "IBM",  163.23 ],
	[ "GOOG", 534.67 ],
	[ "MSFT",  48.96 ],
	[ "IBM",  163.34 ],
	[ "AAPL", 114.25 ],
];

$ticketsLength = count($tickets);


// Set necessary headers
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");

// If connection is closed and then reopened then browser sends last event id that it received.
// So server can continue sending data from that even and not to send all events again.
// Note that it is incremented by one, because we have to send next value (after last id).
// HTTP header value is Last-Event-ID and should be accessible by HTTP_LAST_EVENT_ID field.
$lastId = $_SERVER["HTTP_LAST_EVENT_ID"];
if (isset($lastId) && !empty($lastId) && is_numeric($lastId)) {
	$lastId = intval($lastId);
	$lastId++;
} else {
	$lastId = 0;
}

// Check that lastId is not larger than the size of array - if it is larger star from zero.
if ($lastId >= $ticketsLength) {
	$lastId = 0;
}

// Using while server keeps connection open and thus we have only one request.
// If connection is closed browser will reconnect and will send last event Id.
while (true) {

	sendMessage($lastId, $tickets[$lastId][0], $tickets[$lastId][1]);
	$lastId++;

	// Check that lastId is not larger than the size of array - if it is larger close connection.
	if ($lastId >= $ticketsLength) {
		die();
	}

	// This code tests that last event id really wokrs.
	// Connection is closed on 10, 20 30, etc. ids and then should continue to next id.
	// Uncomment it if you want to test it.
	//if ($lastId % 10 == 0) {
	//	die();
	//}

	// Sleep some random seconds
	sleep(rand(1, 3));
}


// Function to send data in format "ticket:price".
function sendMessage($id, $ticket, $price) {
	echo "id: $id\n";
	echo "data: $ticket:$price\n\n";
	ob_flush();
	flush();
}

?>

