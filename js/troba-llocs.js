;
(function(global, $) {
    var Troballocs = function(options) {
        return new Troballocs.init(options);
    }
    var _options = {
        domain: 'https://betaserver.icgc.cat/icgc_geocoder/?maxresultats=17&obtenirCoordGeografiques=si&tipus=Cap%20de%20Municipi&metode=localitzaToponim&ordre=alfabetic&trobaTots=no&nom=',
        filter: '.cat'
    };

    Troballocs.prototype = {

        initControls: function() {
            var self = this;

            $('.searchboxinput').on('keyup', function(event) {
                if (event.which == 13) {
                    self.checkInput(true);
                    event.preventDefault();
                } else {
                    self.checkInput(false);
                }

            });

            $(`#${self.container}`).on('click', 'li a', function(e) {
                if ($(this).attr('data')) {
                    var coords = $(this).attr('data').split("#");
                    self.zoomTo(coords[0], coords[1])
                }
            });

        },

        checkInput: function(keyOrigen) {
            var self = this;
            var _toponim = $(".searchboxinput").val();
            if (_toponim && _toponim.length > 2) {
                self.sendRequest(_toponim, keyOrigen);
            } else {
                $('.mygrid').fadeOut();
            }
        },

        sendRequest: function(_toponim, keyOrigen) {
            var self = this;
            $.ajax({
                url: `${self.domain}${ _toponim}`,
                method: 'GET',
                dataType: 'json',
                success: function(data) {

                    if (data) {
                        $('.mygrid').fadeIn();
                        $('.mygrid').html('');
                        if (data.length >= 1) {
                            var cList = $('<ul>').appendTo('.mygrid');
                            $.each(data, function(index, value) {

                                $('<li><a data="' + value.coordenadesETRS89LonLat.y + '#' + value.coordenadesETRS89LonLat.x + '" href="#"> ' +
                                    '<b>' + value.nom + '</b> (' + value.nomMunicipi + ')</a>').appendTo(cList);

                                if (keyOrigen && data.length >= 1) {

                                    self.zoomTo(value.coordenadesETRS89LonLat.y, value.coordenadesETRS89LonLat.x)

                                }

                            });
                        }
                    } else {
                        $('.mygrid').html("An error occured:");
                    }
                },
                error: function(xhr) {
                    $('.mygrid').html("An error occured: " + xhr.status + " " + xhr.statusText);
                }

            });
        },

        zoomTo: function(lat, lon) {
            var self = this;
            self.netejaPantalla();
            self.map.flyTo({ center: [lon, lat], zoom: 13 });
        },

        netejaPantalla: function() {
            $('.mygrid').fadeOut();
            $(".searchboxinput").val('');
        }

    };

    Troballocs.init = function(options) {
        var self = this;
        self = $.extend(self, _options, options);

        $(`#${self.container}`).html('<div class="ui fluid icon input"><input class="searchboxinput" type="text" placeholder="Anar a...(Municipi)"><i class="search icon"></i></div><div class="mygrid"></div>');

        self.initControls();

    }

    Troballocs.init.prototype = Troballocs.prototype;

    global.Troballocs = Troballocs;

}(window, jQuery));