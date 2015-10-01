
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    /*Image is too large when using view portWidth;
    var viewPortWidth = $(window).width();
    var viewPortHeight = $(window).height();
    var size = 'size=' + viewPortWidth + 'x' + viewPortHeight;
    */
    var size = 'size=' + 600 + 'x' + 400;

    var street = $('#street').val();
    var city = $('#city').val();
    var location = 'location=' + street + ', ' + city;

    var googleStreetviewURL = "https://maps.googleapis.com/maps/api/streetview?" + size + '&' + location;
    $body.append('<img class="bgimg" src="' + googleStreetviewURL + '">');

    // load stupid articles
    var timesAPIKey = '89c880ca573eb613764e2d4755212686:0:72981098'
    var timesURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json' + '?q=' + city + '&fq=glocations:(' + city +')' + '&api-key=' + timesAPIKey

    $.getJSON(timesURL, function (data) {
            for (var i in data.response.docs) {
                // Getting rid of the stupid '/' at the end of some URL's which mess up the link.
                var rawURL = data.response.docs[i].web_url;
                var formattedURL;
                if (rawURL.charAt(rawURL.length -1) === '/') {
                    formattedURL = rawURL.substring(0, rawURL.length -1);
                } else {
                    formattedURL = rawURL;
                }
                
                // Some paragraphs are null.
                var rawParagraph= data.response.docs[i].lead_paragraph;
                var formattedParagraph;
                if (!rawParagraph) {
                    formattedParagraph = "No paragraph available for this story. Click link to read.";
                } else {
                    formattedParagraph = rawParagraph
                }

                var articleHTML = '<li class="article">' +
                '<a href=' + formattedURL + '>' + data.response.docs[i].headline.main + '</a>' +
                '<br>' +
                '<p>' + formattedParagraph + '</p>' +
                '</li>';
                $('#nytimes-articles').append(articleHTML);
            }
       }
    ).fail( function() {
            $('#nytimes-articles').append("No NYT Articles can be displayed.");
            }
    );

    // load wiki links.
    var timeoutError = setTimeout(function() {
                            $wikiElem.text("No Wikipedia Links.");
                        }, 8000);

    var wikipediaURL = 'https://en.wikipedia.org/w/api.php?&action=query&format=json&list=search&srsearch=' + city;
    var ajaxSettings = {dataType: 'jsonp',
                        success: function(response) {
                                for (var i in response.query.search) {
                                    var title = response.query.search[i].title;
                                    $('#wikipedia-links').append('<li class="wikipedia-link"><a href="http://en.wikipedia.org/wiki/' +
                                                                title +
                                                                '">' +
                                                                title +
                                                                '</a>' +
                                                                '</li>');
                                }
                                clearTimeout(timeoutError);
                            }

    };

    var response = $.ajax(wikipediaURL, ajaxSettings);
    return false;
};

$('#form-container').submit(loadData);
