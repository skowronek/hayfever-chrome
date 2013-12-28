// Generated by CoffeeScript 1.6.3
/*
Harvest API Wrapper

Depends on:
	- jQuery
	- Sugar.js
	- Underscore.js
*/


(function() {
  var Harvest;

  Harvest = (function() {
    function Harvest(subdomain, auth_string) {
      this.subdomain = subdomain;
      this.auth_string = auth_string;
      this.full_url = "https://" + this.subdomain + ".harvestapp.com";
      this.ajax_defaults = {
        type: 'GET',
        dataType: 'json',
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': "Basic " + this.auth_string
        }
      };
    }

    /*
    	Build URL for and API call
    
    	@param {String[]} arguments
    	@returns {String}
    */


    Harvest.prototype.build_url = function() {
      var url;
      url = this.full_url;
      $.each(arguments, function(i, v) {
        return url += "/" + v;
      });
      return "" + url + ".json";
    };

    /*
    	Get API rate limit status
    
    	@returns {jqXHR}
    */


    Harvest.prototype.rate_limit_status = function() {
      var url;
      url = this.build_url('account', 'rate_limit_status');
      return $.ajax(url, this.ajax_defaults);
    };

    /*
    	Get all timesheet entries (and project list) for a given day
    
    	@param {Date} date
    	@param {Boolean} async
    	@returns {jqXHR}
    */


    Harvest.prototype.get_day = function(date, async) {
      var ajax_opts, day_url;
      if (async == null) {
        async = true;
      }
      day_url = date === 'today' ? this.build_url('daily') : this.build_url('daily', date.getDOY(), date.getFullYear());
      ajax_opts = $.extend(this.ajax_defaults, {
        async: async
      });
      return $.ajax(day_url, ajax_opts);
    };

    /*
    	Convenience method for getting today's entries
    
    	@param {Boolean} async
    	@returns {jqXHR}
    */


    Harvest.prototype.get_today = function(async) {
      if (async == null) {
        async = true;
      }
      return this.get_day('today', async);
    };

    /*
    	Get an individual timer by ID
    
    	@param {Number} eid
    	@param {Boolean} async
    	@returns {jqXHR}
    */


    Harvest.prototype.get_entry = function(eid, async) {
      var ajax_opts, url;
      if (async == null) {
        async = true;
      }
      url = this.build_url('daily', 'show', eid);
      ajax_opts = $.extend(this.ajax_defaults, {
        async: async
      });
      return $.ajax(url, ajax_opts);
    };

    /*
    	Find runaway timers from yesterday
    
    	@param {Function} callback
    	@param {Boolean} async
    	@returns {jqXHR}
    */


    Harvest.prototype.runaway_timers = function(callback, async) {
      var request, yesterday;
      if (callback == null) {
        callback = $.noop;
      }
      if (async == null) {
        async = true;
      }
      yesterday = Date.create('yesterday');
      request = this.get_day(yesterday, async);
      return request.success(function(json) {
        var entries, runaways;
        if (json.day_entries != null) {
          entries = json.day_entries;
          runaways = _(entries).filter(function(entry) {
            return entry.hasOwnProperty('timer_started_at');
          });
          return callback.call(entries, runaways);
        }
      });
    };

    /*
    	Toggle a single timer on/off
    
    	@param {Number} eid
    	@param {Boolean} async
    	@returns {jqXHR}
    */


    Harvest.prototype.toggle_timer = function(eid, async) {
      var ajax_opts, url;
      if (async == null) {
        async = true;
      }
      url = this.build_url('daily', 'timer', String(eid));
      ajax_opts = $.extend(this.ajax_defaults, {
        async: async
      });
      return $.ajax(url, ajax_opts);
    };

    /*
    	Create a new entry, optional starting its timer on creation
    
    	@param {Object} props
    	@param {Boolean} async
    	@returns {jqXHR}
    */


    Harvest.prototype.add_entry = function(props, async) {
      var ajax_opts, url;
      if (async == null) {
        async = true;
      }
      url = this.build_url('daily', 'add');
      ajax_opts = $.extend(this.ajax_defaults, {
        type: 'POST',
        async: async,
        data: props
      });
      return $.ajax(url, ajax_opts);
    };

    /*
    	Delete an entry
    
    	@param {Number} eid
    	@param {Boolean} async
    	@returns {jqXHR}
    */


    Harvest.prototype.delete_entry = function(eid, async) {
      var ajax_opts, url;
      if (async == null) {
        async = true;
      }
      url = this.build_url('daily', 'delete', String(eid));
      ajax_opts = $.extend(this.ajax_defaults, {
        type: 'DELETE',
        async: async
      });
      return $.ajax(url, ajax_opts);
    };

    /*
    	Update an entry
    
    	@param {Number} eid
    	@param {Object} props
    	@param {Boolean} async
    	@returns {jqXHR}
    */


    Harvest.prototype.update_entry = function(eid, props, async) {
      var ajax_opts, url;
      if (async == null) {
        async = true;
      }
      url = this.build_url('daily', 'update', String(eid));
      ajax_opts = $.extend(this.ajax_defaults, {
        type: 'POST',
        async: async,
        data: props
      });
      return $.ajax(url, ajax_opts);
    };

    return Harvest;

  })();

  window.Harvest = Harvest;

}).call(this);