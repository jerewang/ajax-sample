<?php
# A PHP script to return book data.  Author: Marty Stepp, Nov 30 2008
$BOOKS_FILE = "books.txt";

# Removes all characters except letters/numbers from query parameters
function filter_chars($str) {
	return preg_replace("/[^A-Za-z0-9_]*/", "", $str);
}


# main program
if (!isset($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] != "GET") {
	header("HTTP/1.1 400 Invalid Request");
	die("ERROR 400: Invalid request - This service accepts only GET requests.");
}

$category = "";
$delay = 0;

if (isset($_REQUEST["category"])) {
	$category = filter_chars($_REQUEST["category"]);
}
if (isset($_REQUEST["delay"])) {
	# for debugging; makes the service delay for a given number of seconds to test 'loading' animations
	$delay = max(0, min(60, (int) filter_chars($_REQUEST["delay"])));
}

if ($delay > 0) {
	sleep($delay);
}

# read file
if (!file_exists($BOOKS_FILE)) {
	header("HTTP/1.1 500 Server Error");
	die("ERROR 500: Server error - Unable to read input file: $BOOKS_FILE");
}

header("Content-type: application/xml");
print "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";

if ($category) {
	print "<books>\n";
	foreach (file($BOOKS_FILE) as $line) {
		# Bachelor Chow in 20 Minutes|Gloria Demartelaere|cooking|2005|30.00
		list($title, $author, $book_category, $year, $price) = explode("|", trim($line));
		if ($book_category == $category) {
			# print it as XML
			print "\t<book category=\"$category\" year=\"$year\" price=\"$price\">\n";
			print "\t\t<title>$title</title>\n";
			print "\t\t<author>$author</author>\n";
			print "\t</book>\n";
		}
	}
	print "</books>\n";
} else {
	print "<categories>\n";
	$categories = array();
	foreach (file($BOOKS_FILE) as $line) {
		list($title, $author, $book_category, $year, $price) = explode("|", trim($line));
		if (!isset($categories[$book_category])) {
			$categories[$book_category] = 1;
		}
	}
	ksort($categories);
	foreach ($categories as $book_category => $useless) {
		print "\t<category>$book_category</category>\n";
	}
	print "</categories>\n";
}
?>
