angular.module('app').
  value('cbSites', {
   /*  'L': 'Let\'s Help',
    'D': 'Deer Creek',
    'A': 'Antioch',
    'O': 'Other' */
    'E': 'Echo Ridge',
    'PR': 'Pine Ridge',
    'SS': 'State Street',
    'JT': 'Jackson Towers',
    'PT': 'Polk Towers',
    'TTI': 'Tenn Town I',
    'TTII': 'Tenn Town II',
    'TT': 'Tyler Towers',
  }).
  factory('cbCurrentSite', function(cbSites) {
    var currentSite;

    return {
      name: function() {
        return cbSites[currentSite];
      },
      get: function() {
        return currentSite;
      },
      set: function(site) {
        currentSite = site;
      },
      exists: function() {
        return !!currentSite;
      },
      clear: function() {
        currentSite = null;
      }
    };
});