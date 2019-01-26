/**
 * Created by steb on 18.02.2015.
 */
define([
    'browsered-jasmine-cucumber/core',
    'browsered-jasmine-cucumber/cucumber',
    'browsered-jasmine-cucumber/jsRunner/GroupsRunner'
], function(bjc, c, GroupsRunner){
    window.GroupsRunner = bjc.GroupsRunner = GroupsRunner;

    return bjc;
});
