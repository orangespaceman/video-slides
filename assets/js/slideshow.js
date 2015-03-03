/*
 * Full screen image/video slideshow
 */
(function ($, window, undefined) {

    var $slides, $wrapper, $bigVideoWrap,
        $document = $(document),
        $window = $(window),
        slideCount,
        bigVideo,
        bigVideoPlayer,
        currentSlide = 0,
        isTransitioning = false,
        transitionDuration = 1000;

    $document.ready(init);

    function init () {
        getEls();
        setWidths();
        createVideo();
        setNav();
    }

    function getEls () {
        $slides = $('.slide');
        $wrapper = $('.wrapper');
        slideCount = $slides.length;
    }

    function setWidths () {
        $wrapper.width((slideCount * 100) + '%');
        $slides.width((100 / slideCount) + '%');
    }

    function createVideo () {
        bigVideo = new $.BigVideo();
        bigVideo.init();
        bigVideoPlayer = bigVideo.getPlayer();
        $bigVideoWrap = $('#big-video-wrap');
        showVideo();
    }

    function showVideo () {
        var videoSrc = $slides.eq(currentSlide).attr('data-video');
        if (videoSrc) {
            bigVideo.show(videoSrc);
            $slides.eq(currentSlide).animate({
                opacity: 0
            }, transitionDuration);
        }
    }

    function setNav () {
        $('.btn-next').on('click', onNext);
        $('.btn-prev').on('click', onPrev);

        $window.on('keydown', function (e) {
            switch(e.keyCode) {
                case 37: //left
                case 38: // up
                    onPrev(e);
                break;

                case 39: // right
                case 40: // down
                    onNext(e);
                break;
            }
        });
    }

    function onNext (e) {

        e.preventDefault();

        if (isTransitioning) { return; }
        if (currentSlide >= slideCount -1) { return; }

        currentSlide++;
        isTransitioning = true;

        bigVideoPlayer.pause();

        $bigVideoWrap
            .animate({
                left: '-100%'
            }, transitionDuration);

        $wrapper
            .animate({
                left: '-' + (100 * currentSlide) + '%'
            },
            transitionDuration,
            onTransitionComplete);
    }

    function onPrev (e) {
        e.preventDefault();

        if (isTransitioning) { return; }
        if (currentSlide <= 0) { return; }

        currentSlide--;
        isTransitioning = true;

        bigVideoPlayer.pause();

        $bigVideoWrap
            .animate({
                left: '100%'
            }, transitionDuration);

        $wrapper
            .animate({
                left: '-' + (100 * currentSlide) + '%'
            },
            transitionDuration,
            onTransitionComplete);
    }

    function onTransitionComplete () {
        isTransitioning = false;
        $bigVideoWrap.css({left: 0});
        $slides.not(':eq(' + currentSlide + ')').css({opacity: 1});
        showVideo();
    }

})(jQuery, window);