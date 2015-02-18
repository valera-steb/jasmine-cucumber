/**
 * Created by steb on 18.02.2015.
 */
require.config({
    deps: ['../dist/browsered-jasmine-cucumber'],

    callback: function () {
        require([
            'browsered-jasmine-cucumber',
            'spec',
            'steps'
        ], function () {
            var runner = window.GroupsRunner(window.fetureGroups, window.stepsGroups);

            for (var i in window.fetureGroups)
                runner(i);
        });
    }
});