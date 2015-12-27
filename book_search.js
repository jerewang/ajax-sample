window.onload = function() {
    new Ajax.Request("books.php", 
        {
            method: "GET",
            onSuccess: showCategories,
            onFailure: ajaxFailed,     // function shown in previous sections
            onException: ajaxFailed
        }
    );
};

function showCategories(ajax) {
    // clear out the list of categories
    while ($("categories").firstChild) {
        $("categories").removeChild($("categories").firstChild);
    }

    // add all categories from the XML to the page's bulleted list
    var categories = ajax.responseXML.getElementsByTagName("category");
    for (var i = 0; i < categories.length; i++) {
        var categoryName = categories[i].firstChild.nodeValue;

        // create a new <li> tag and add it to the page
        var li = document.createElement("li");
        li.innerHTML = categoryName;
        li.onclick = categoryClick;
        $("categories").appendChild(li);
    }
}

function categoryClick() {
    new Ajax.Request("books.php", 
        {
            method: "GET",
            parameters: {category: this.innerHTML},
            onSuccess: showBooks,
            onFailure: ajaxFailed,
            onException: ajaxFailed
        }
    );
}

function showBooks(ajax) {
    // clear out the list of categories
    while ($("books").firstChild) {
        $("books").removeChild($("books").firstChild);
    }
    
    // add all books from the XML to the page's bulleted list
    var books = ajax.responseXML.getElementsByTagName("book");
    for (var i = 0; i < books.length; i++) {
        var titleNode  = books[i].getElementsByTagName("title")[0];
        var authorNode = books[i].getElementsByTagName("author")[0];
        var title  = titleNode.firstChild.nodeValue;
        var author = authorNode.firstChild.nodeValue;
        var year = books[i].getAttribute("year");
        
        var li = document.createElement("li");
        li.innerHTML = title + ", by " + author + " (" + year + ")";
        $("books").appendChild(li);
    }
}
//function showBooks(ajax) {
    //// clear out the list of categories
    //while ($("books").firstChild) {
        //$("books").removeChild($("books").firstChild);
    //}
    
    //// add all books from the XML to the page's bulleted list
    //var data = JSON.parse(ajax.responseText);
    //for (var i = 0; i < data.books.length; i++) {
        //var title  = data.books[i].title;
        //var author = data.books[i].author;
        //var year = data.books[i].year;
        
        //var li = document.createElement("li");
        //li.innerHTML = title + ", by " + author + " (" + year + ")";
        //$("books").appendChild(li);
    //}
//}
