var alignGallery = function () {
    var $galleryContainer = $('#participants');
    $galleryContainer.masonry({
        itemSelector: '.item'
    });

    $galleryContainer.find('img').load(function () {
        $galleryContainer.masonry();
    })
};

alignGallery();