/**
 * Created by steb on 18.02.2015.
 */
require.config({
    paths: {
        "lib": '../lib/browsered-jasmine-cucumber'
    },
    callback: function () {
        var specs = [
        ];

        (function getSpec(id) {
            if (id == specs.length) {
          //      jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
                jasmine.getEnv().execute();
                return;
            }

            require([specs[id]], function () {
                getSpec(id + 1);
            });
        })(0);
    }

});