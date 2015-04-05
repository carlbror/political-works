typeOfWork = [
    {clientName: "Article", htmlName: "article"},
    {clientName: "Series of articles", htmlName: "series-of-articles"},
    {clientName: "Peer reviewed article", htmlName: "peer-reviewed-article"},
    {clientName: "Pamphlet", htmlName: "pamphlet"},
    {clientName: "Book", htmlName: "book"},
    {clientName: "Book chapter", htmlName: "book-chapter"},
    {clientName: "Documentary", htmlName: "documentary"},
    {clientName: "Picture", htmlName: "picture"},
    {clientName: "Lecture", htmlName: "lecture"},
    {clientName: "Movie", htmlName: "movie"},
    {clientName: "Short film", htmlName: "short-film"},
    {clientName: "Other", htmlName: "other"}
];

familiarity = [
    {clientName: "Haven't read/watched it", number: 0},
    {clientName: "Briefly familiar", number: 1},
    {clientName: "Read/watched it once", number: 4},
    {clientName: "Read/watched it a few times", number: 5},
    {clientName: "Know it by heart", number: 7}
];

familiarityReveresed = familiarity.reverse();

urlRegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;