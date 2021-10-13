$(document).ready(() => {
    $('.slider-active-3').owlCarousel({
        loop: true,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 1,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })

    $('.category-slider-2').owlCarousel({
        autoplay: false,
        loop: false,
        smartSpeed: 1000,
        navText: [
            "<ion-icon name='arrow-forward-outline'></ion-icon>",
            "<ion-icon name='arrow-forward-outline'></ion-icon>",
        ],
        nav: false,
        dots: false,
        margin: 10,
        responsive: {
            0: {
                items: 2,
                autoplay: true,
                loop: true,
                nav: false,
            },
            360: {
                items: 2,
                autoplay: true,
                loop: true,
            },
            500: {
                items: 2,
                autoplay: true,
                loop: true,
            },
            768: {
                items: 3,
                nav: true,
                margin: 30,
            },
            992: {
                items: 4,
                margin: 30,
            },
            1200: {
                items: 5,
                margin: 30,
            }
        }
    })

    $('.hot-deal-2').owlCarousel({
        autoplay: false,
        nav: true,
        smartSpeed: 1000,
        dots: false,
        items: 2,
        loop: false,
        margin: 30,
        responsive: {
            0: {
                items: 1,
                autoplay: true,
                loop: true,
            },
            360: {
                items: 1,
                autoplay: true,
                loop: true,
            },
            576: {
                items: 1,
                autoplay: true,
                loop: true,

            },
            768: {
                items: 1,
            },
            992: {
                items: 1,
            },
            1200: {
                items: 2,
            }
        }
    });

    $('#bar-rating').barrating({ theme: 'fontawesome-stars' });

    $('input[type="number"]').niceNumber({
        autoSizeBuffer: 10,
    });
    // * plugin activation end =================

    const _csrfToken = $('meta[name=_csrf]').attr('content');

    // sticky menu
    $(window).scroll(function () {
        var window_top = $(window).scrollTop() + 1;
        if (window_top > 50) {
            $('.sticky-nav').addClass('menu_fixed animated fadeInDown');
        } else {
            $('.sticky-nav').removeClass('menu_fixed animated fadeInDown');
        }
    });
})