$(document).ready(function() {
    // Set the target date
    var targetDate = new Date("2024-08-18T00:00:00");

    var Countdown = {
        // Backbone-like structure
        $el: $('.countdown'),

        // Params
        countdown_interval: null,
        total_seconds     : 0,

        // Initialize the countdown  
        init: function() {
            // DOM
            this.$ = {
                hours  : this.$el.find('.bloc-time.hours .figure'),
                minutes: this.$el.find('.bloc-time.min .figure'),
                seconds: this.$el.find('.bloc-time.sec .figure')
            };

            // Init countdown values
            var now = new Date();
            this.total_seconds = Math.floor((targetDate - now) / 1000);

            this.values = {
                hours  : Math.floor(this.total_seconds / (60 * 60)),
                minutes: Math.floor((this.total_seconds % (60 * 60)) / 60),
                seconds: this.total_seconds % 60
            };

            // Initialize countdown values
            this.count();    
        },

        count: function() {
            var that    = this,
                $hour_1 = this.$.hours.eq(0),
                $hour_2 = this.$.hours.eq(1),
                $min_1  = this.$.minutes.eq(0),
                $min_2  = this.$.minutes.eq(1),
                $sec_1  = this.$.seconds.eq(0),
                $sec_2  = this.$.seconds.eq(1);

            this.countdown_interval = setInterval(function() {
                var now = new Date();
                that.total_seconds = Math.floor((targetDate - now) / 1000);

                if (that.total_seconds > 0) {
                    that.values.hours  = Math.floor(that.total_seconds / (60 * 60));
                    that.values.minutes = Math.floor((that.total_seconds % (60 * 60)) / 60);
                    that.values.seconds = that.total_seconds % 60;

                    // Update DOM values
                    // Hours
                    that.checkHour(that.values.hours, $hour_1, $hour_2);

                    // Minutes
                    that.checkHour(that.values.minutes, $min_1, $min_2);

                    // Seconds
                    that.checkHour(that.values.seconds, $sec_1, $sec_2);

                    --that.total_seconds;
                } else {
                    clearInterval(that.countdown_interval);
                    that.hideCountdown();
                    that.showCelebration();
                }
            }, 1000);    
        },

        animateFigure: function($el, value) {
            var that         = this,
                $top         = $el.find('.top'),
                $bottom      = $el.find('.bottom'),
                $back_top    = $el.find('.top-back'),
                $back_bottom = $el.find('.bottom-back');

            // Before we begin, change the back value
            $back_top.find('span').html(value);

            // Also change the back bottom value
            $back_bottom.find('span').html(value);

            // Then animate
            gsap.to($top, {
                rotationX: '-180deg',
                transformPerspective: 300,
                ease: "quart.out",
                onComplete: function() {
                    $top.html(value);
                    $bottom.html(value);
                    gsap.set($top, { rotationX: 0 });
                }
            });

            gsap.to($back_top, { 
                rotationX: 0,
                transformPerspective: 300,
                ease: "quart.out", 
                clearProps: 'all' 
            });    
        },

        checkHour: function(value, $el_1, $el_2) {
            var val_1       = value.toString().charAt(0),
                val_2       = value.toString().charAt(1),
                fig_1_value = $el_1.find('.top').html(),
                fig_2_value = $el_2.find('.top').html();

            if (value >= 10) {
                // Animate only if the figure has changed
                if (fig_1_value !== val_1) this.animateFigure($el_1, val_1);
                if (fig_2_value !== val_2) this.animateFigure($el_2, val_2);
            } else {
                // If we are under 10, replace first figure with 0
                if (fig_1_value !== '0') this.animateFigure($el_1, 0);
                if (fig_2_value !== val_1) this.animateFigure($el_2, val_1);
            }    
        },

        hideCountdown: function() {
            // Hide countdown timer
            this.$el.fadeOut();
        },

        showCelebration: function() {
            // Show message and confetti
            $('#message').fadeIn();
            confetti(); // Trigger confetti animation

            // Show button after 30 seconds
            setTimeout(function() {
                $('#button-container').fadeIn();
                // Add click event listener to button
                $('#press-me').on('click', function() {
                    window.location.href = 'birthdayCard.html';
                });
            }, 2000); // 2 seconds
        }
    };

    // Initialize countdown
    Countdown.init();
});
