;(function() {
  "use strict";

  angular
  .module('alt.alerta-flutuante', [])
  .constant('AltAlertaFlutuanteEventos', {
    EVENTO_ALERTA_FLUTUANTE: 'alt.exibe-alerta-flutuante',
    EVENTO_ESCONDER_ALERTA_FLUTUANTE: 'alt.esconde-alerta-flutuante',
    TROCA_ROTA: '$locationChangeSuccess'
  })
  .service('AltAlertaFlutuanteService', ['$rootScope', 'AltAlertaFlutuanteEventos', function($rootScope, AltAlertaFlutuanteEventos) {
    this.exibe = function(opt) {
      $rootScope.$broadcast(AltAlertaFlutuanteEventos.EVENTO_ALERTA_FLUTUANTE, opt);
    };

    this.esconde = function(opt) {
      $rootScope.$broadcast(AltAlertaFlutuanteEventos.EVENTO_ESCONDER_ALERTA_FLUTUANTE, opt);
    };
  }])
  .directive('altAlertaFlutuante', ['$rootScope', '$sce', 'AltAlertaFlutuanteEventos', function($rootScope, $sce, AltAlertaFlutuanteEventos) {
    var _template = '<div>\
                      <div id="alerta-flutuante-blanket" ng-show="comBlanket"></div>\
                      <div id="alerta-flutuante" class="alert alert-{{tipo}} alerta-flutuante" role="alert" style="display: none;">\
                          <button type="button" class="close" ng-show="exibeBtnClose">\
                            <span aria-hidden="true">&times;</span>\
                          </button>\
                          <span class="fa fa-{{icone}} fa-fw"></span>\
                          <strong ng-bind="titulo"></strong>\
                          <p class="espaco-top" ng-bind-html="mensagem"></p>\
                      </div>\
                    </div>';

    var _link = function(scope, element, attrs) {
      var ESTILO_ALERTA_DEFAULT = "danger";
      var ICONE_DEFAULT = 'warning';
      var TITULO_DEFAULT = "Houve um problema";
      var MENSAGEM_DEFAULT = "Ocorreu um erro no momento da solicitação. Por favor, tente novamente mais tarde.";
      var TEMPO_DE_APARICAO = 99;
      var TEMPO_DE_EXIBICAO = 5000;
      var TEMPO_DE_REMOCAO = 33;

      var _alerta = element.find('#alerta-flutuante');
      var _blanket = element.find('#alerta-flutuante-blanket');

      var _escondeAlerta = function() {
          _alerta.stop().fadeOut(TEMPO_DE_REMOCAO);
          _blanket.stop().fadeOut(TEMPO_DE_REMOCAO);
      };

      $rootScope.$on(AltAlertaFlutuanteEventos.EVENTO_ALERTA_FLUTUANTE, function(evento, obj) {
          var _estaAparecendo = _alerta.attr('style').match('block');
          var _estaSumindo = _alerta.attr('style').match('opacity');
          var _obj = angular.isObject(obj) ? obj : {};

          if (!_estaAparecendo  && !_estaSumindo) {
              scope.titulo = _obj.titulo || TITULO_DEFAULT;
              scope.mensagem = $sce.trustAsHtml(_obj.msg || MENSAGEM_DEFAULT);
              scope.tipo = _obj.tipo || ESTILO_ALERTA_DEFAULT;
              scope.icone = _obj.icone || ICONE_DEFAULT;
              scope.tempoVisivel = _obj.tempoVisivel || TEMPO_DE_EXIBICAO;
              scope.exibeBtnClose = angular.isDefined(_obj.exibeBtnClose) ? _obj.exibeBtnClose : true;
              scope.comBlanket = angular.isDefined(_obj.comBlanket) ? _obj.comBlanket : false;

              _alerta.fadeIn(TEMPO_DE_APARICAO)
                     .delay(scope.tempoVisivel)
                     .fadeOut(TEMPO_DE_REMOCAO);

             if (scope.comBlanket) {
               _blanket.fadeIn(TEMPO_DE_APARICAO)
                       .delay(scope.tempoVisivel)
                       .fadeOut(TEMPO_DE_REMOCAO);
             }
          }
      });

      _alerta.find('.close').eq(0).on('click', _escondeAlerta);
      $rootScope.$on(AltAlertaFlutuanteEventos.EVENTO_ESCONDER_ALERTA_FLUTUANTE, _escondeAlerta);
      $rootScope.$on(AltAlertaFlutuanteEventos.TROCA_ROTA, _escondeAlerta);
    }

    var _scope = {};

    var _replace = true;

    var _restrict = 'A';

    return {
              restrict: _restrict,
              replace: _replace,
              template: _template,
              link: _link,
              scope: _scope
           };
  }]);
}());
