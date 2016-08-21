(function() {
    "use strict";

    /* Initialize Variables */
    var ScreenSize = {
        TABLET: 992,
        MOBILE: 600
    };
    var ButtonColor = {
        NORMAL: '#424242',
        SUCCESS: '#4CAF50',
        FAILED: '#F44336'
    };
    var pathname = window.location.pathname.slice(1);
    var isEntity = pathname.match(new RegExp('^p/'));
    var RequestAnimationFrame = requestAnimationFrame || mozRequestAnimationFrame || webkitRequestAnimationFrame || msRequestAnimationFrame;

    var LazyLoad = function() {
        $('body').hide(); // in case page shows up before css is fully loaded

        $('noscript').each(function() {
            var element = $(this).text();
            $(element).insertBefore($(this));
            $(this).remove();
        });

        $('head > style').remove();

        // delay for smoother loading of body
        setTimeout(function() {
            $('body').fadeIn('500');
        }, 0);
    }

    var CloseModal = function() {
        $('._modal_').hide();
        $('body').css({ 'overflow': 'visible' });
    };

    var LoadLeaflet = function() {
        L.Icon.Default.imagePath = '/media/leaflet';
        var mymap = L.map('map', { scrollWheelZoom: false }).setView([32.8818006, -117.2357122], 12);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnNvZSIsImEiOiJjaXJoZmN5emcwMWFjZzNreGhzOXhnMGVuIn0.hx7spsB6PS8BNYvAsWVcmA', {
            accessToken: 'pk.eyJ1IjoiYnNvZSIsImEiOiJjaXJoZmN5emcwMWFjZzNreGhzOXhnMGVuIn0.hx7spsB6PS8BNYvAsWVcmA'
        }).addTo(mymap);
        L.marker([32.8818006, -117.2357122]).addTo(mymap);
        mymap.once('focus', function() { mymap.scrollWheelZoom.enable(); });
        mymap.on('click', function() {
            if (mymap.scrollWheelZoom.enabled()) {
                mymap.scrollWheelZoom.disable();
            } else {
                mymap.scrollWheelZoom.enable();
            }
        });
    };

    var Initialize = function() {
        // LazyLoad(); // lazy load CSS file

        // setup navbar
        try {
            $('._nav-item_').removeClass('active'); // sanity check
            $('#_' + pathname + '_').addClass('active');
        } catch (e) {
            if (isEntity) {
                $('#_projects_').addClass('active');
            }
        }

        // delay removing lightbox div
        if (!isEntity) {
            $('div[id^="lightbox"]').remove();
            $('div[class^="lightbox"]').remove();
        }

        // delay loading leaflet
        if (pathname === 'contact') {
            setTimeout(LoadLeaflet, 0);
        }

        // delay google analytics tracking
        setTimeout(function() {
            (function(i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function() {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-82807303-1', 'auto');
            ga('send', 'pageview');
        }, 0);

        console.log("Hello developer(s)! Here are some quick links you might be interested in:\n * Resume: http://briansoe.com/resume\n * Repository: https://github.com/bsoe003/website");
    }

    /* Start Initialization */
    if (RequestAnimationFrame) {
        RequestAnimationFrame(function() {
            setTimeout(Initialize, 0);
        });
    } else {
        window.addEventListener('load', Initialize);
    }

    // transition out right before exit
    window.addEventListener("beforeunload", function() {
        document.body.classList.add("animate-out");
    });

    // exit any modal upon pushing "esc"
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            CloseModal();
        }
    });

    // Javascript alternative to open on new window
    $('a').click(function(e) {
        if ($(this).attr('target') === '_blank') {
            window.open($(this).attr('href'));
            return false;
        }
    });

    // click anywhere but nav dropdown
    $('body').click(function(e) {
        var width = $('body').width();
        if (width <= ScreenSize.MOBILE && !$(e.target).is('nav > ul > li > a')) {
            $('nav > ul').slideUp();
        }
    });

    // nav dropdown event handler
    $('#mobile-menu').click(function(e) {
        e.stopPropagation();
        $('nav > ul').slideToggle();
    });

    // nav dropdown screen handler
    $(window).resize(function() {
        var width = $('body').width();
        if (width > ScreenSize.MOBILE) {
            $('nav > ul').show();
        } else {
            $('nav > ul').hide();
        }
    });

    // close modal when clicking anywhere but modal
    $(window).click(function(e) {
        if ($(e.target).is($('._modal_'))) {
            CloseModal();
        }
    });

    // open modal; disable scrolling for background;
    $('#open-contact-form').click(function(e) {
        $('#contact-form-box').show();
        $('body').css({ 'overflow': 'hidden' });
    });

    // close modal
    $('._close_').click(function(e) {
        CloseModal();
    });

    // contact form handler
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        var name = e.target.name.value.trim();
        var email = e.target.email.value.trim();
        var subject = e.target.subject.value.trim();
        var content = e.target.content.value.trim();
        if (!email || !subject || !content) {
            e.target.submit.value = 'Error :(';
            $(e.target.submit).css({ 'background-color': ButtonColor.FAILED });
            if (!email) {
                $(e.target.email).css({ 'border-color': '#F44336' });
            } else if (!subject) {
                $(e.target.subject).css({ 'border-color': '#F44336' });
            } else if (!content) {
                $(e.target.content).css({ 'border-color': '#F44336' });
            }
            return false;
        }
        e.target.submit.value = 'Sending ...';
        $.ajax({
            contentType: 'application/json',
            data: JSON.stringify({ name: name, _email: email, subject: subject, content: content }),
            dataType: 'json',
            success: function(data) {
                e.target.submit.value = 'Success :)';
                $(e.target.submit).css({ 'background-color': ButtonColor.SUCCESS });
                setTimeout(function() {
                    e.target.submit.value = 'Send Message';
                    $(e.target.submit).css({ 'background-color': ButtonColor.NORMAL });
                    e.target.name.value = '';
                    e.target.email.value = '';
                    e.target.subject.value = '';
                    e.target.content.value = '';
                    $('._modal_').hide();
                    $('body').css({ 'overflow': 'visible' });
                }, 3000);
            },
            error: function() {
                e.target.submit.value = 'Error :(';
                $(e.target.submit).css({ 'background-color': ButtonColor.FAILED });
            },
            processData: false,
            type: 'POST',
            url: '/mail'
        });
    });

}).call(this);
