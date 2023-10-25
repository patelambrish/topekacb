angular.module('app').
  value('cbSites', {
    'Breakthrough':'Breakthrough',
    'Echo Ridge': 'Echo Ridge',
    'Equiventure': 'Equiventure',
    'JAAA': 'JAAA',
    'Jackson Towers':'Jackson Towers',
    'Plaza West': 'Plaza West', 
    'Polk Towers': 'Polk Towers',
    'Tenn Town 1': 'Tenn Town 1',
    'Tenn Town 2': 'Tenn Town 2',
    'Tyler Towers': 'Tyler Towers',  
    'Other': 'Other'
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