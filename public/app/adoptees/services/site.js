angular.module('app').
  value('cbSites', {
   /*  'L': 'Let\'s Help',
    'D': 'Deer Creek',
    'A': 'Antioch',
    'O': 'Other' */
    'Echo Ridge': 'Echo Ridge',
    'CRC/Lundgren': 'CRC/Lundgren',
    'Salvation Army': 'Salvation Army',    
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