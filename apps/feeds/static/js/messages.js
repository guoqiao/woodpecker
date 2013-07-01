$(document).ready(function() {
    var delayTime  = 3000;
    var alerts     = $('.alert');

    delayTime = delayTime + (alerts.length * 250);

    alerts.each(function() {
        $(this).delay(delayTime).fadeOut('slow');
        delayTime -= 250;
        console.log(delayTime);
    });
});
