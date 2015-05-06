Template.frontPage.rendered = function(){

    var entireOwl = $('.owl');

    entireOwl.owlCarousel({

        navigation: false, // Show next and prev buttons
        pagination: false,
        mouseDrag: false,
        touchDrag: false,

        autoPlay: 25000,
        stopOnHover: false,
        paginationSpeed: 2000,
        singleItem: true,
        transitionStyle: "fade",

        afterAction: callback

        // "singleItem:true" is a shortcut for:
//            items : 1,
//            itemsDesktop : false,
//            itemsDesktopSmall : false,
//            itemsTablet: false,
//            itemsMobile : false
    });

    function callback(){
        if(!entireOwl.data('owlCarousel') ||_.contains([0,1,3], entireOwl.data('owlCarousel').currentItem)){
            setTimeout(function(){
                entireOwl.trigger('owl.next');
            }, 10000);
        }
    };

};