;(function(ng) {
  "use strict";

  ng.module('alt.alerta-flutuante', [])
    .constant('AltAlertaFlutuanteEventos', {
      EVENTO_ALERTA_FLUTUANTE: 'alt.exibe-alerta-flutuante',
      EVENTO_ESCONDER_ALERTA_FLUTUANTE: 'alt.esconde-alerta-flutuante'
    })
    .service('AltAlertaFlutuanteService', ['$rootScope', 'AltAlertaFlutuanteEventos', function($rootScope, AltAlertaFlutuanteEventos) {
      this.exibe = function(opt) {
        $rootScope.$broadcast(AltAlertaFlutuanteEventos.EVENTO_ALERTA_FLUTUANTE, opt);
      };

      this.esconde = function(opt) {
        $rootScope.$broadcast(AltAlertaFlutuanteEventos.EVENTO_ESCONDER_ALERTA_FLUTUANTE, opt);
      };
    }])
    .directive('altAlertaFlutuante', ['$rootScope', '$timeout', '$sce', 'AltAlertaFlutuanteEventos', function($rootScope, $timeout, $sce, AltAlertaFlutuanteEventos) {
      var TEMPLATE = '<div>\
                        <div id="alt-alerta-flutuante-blanket" ng-show="comBlanket"></div>\
                        <div id="alt-alerta-flutuante" class="alert alert-{{tipo}} alt-alerta-flutuante alt-sombra-secundaria" role="alert" style="display: none;">\
                          <button type="button" class="close" ng-show="exibeBtnClose">\
                            <span aria-hidden="true">&times;</span>\
                          </button>\
                          <span class="fa fa-{{icone}} fa-fw"></span>\
                          <strong ng-bind="titulo"></strong>\
                          <p class="alt-espacamento-top alt-alerta-flutuante-mensagem" ng-bind-html="mensagem"></p>\
                          <div class="alt-espacamento-top" ng-show="listaMsg.length">\
                          	<div>\
                          		<small class="alt-hand alt-alerta-flutuante-label-agrupador-mensagens" ng-click="toggleMensagens()">\
                          			<span>Mais mensagens</span>\
                          			<span class="fa fa-fw fa-angle-down"></span>\
                          		</small>\
                          	</div>\
                          	<div>\
                          		<ul class="alt-alerta-flutuante-agrupador-mensagens alt-espacamento-top hidden">\
                          			<li ng-repeat="m in listaMsg track by $index">\
                          				<small>\
                          					<span class="alt-alerta-flutuante-separador-mensagens">·</span>\
                          					<span ng-bind="m.mensagem"></span>\
                          				</small>\
                          			</li>\
                          		</ul>\
                          	</div>\
                          </div>\
                          <div id="alt-alerta-flutuante-tempo" ng-style="{\'border-color\': corBarraTempo}"></div>\
                        </div>\
                      </div>';

      var _link = function(scope, element, attrs) {
        var ESTILO_ALERTA_DEFAULT = "danger";
        var ICONE_DEFAULT = 'warning';
        var TITULO_DEFAULT = "Houve um problema";
        var MENSAGEM_DEFAULT = "Ocorreu um erro no momento da solicitação. Por favor, tente novamente mais tarde.";
        var TEMPO_DE_APARICAO = 99;
        var TEMPO_DE_EXIBICAO = 10000;
        var TEMPO_DE_REMOCAO = 33;
        var TEMPO_INICIALIZACAO_BARRA_TEMPO = 1000;
        var COR_TEMPO_SUCCESS = '#528c49';
        var COR_TEMPO_DANGER = '#c56666';
        var COR_TEMPO_INFO = '#31708f';
        var COR_TEMPO_WARNING = '#8a6d3b';

        var _elementoAlerta = element.find('#alt-alerta-flutuante');
        var _elementoBlanket = element.find('#alt-alerta-flutuante-blanket');
        var _elementoTempo = element.find('#alt-alerta-flutuante-tempo');
        var _elementoClose =_elementoAlerta.find('.close').eq(0);
        var _elementoLabelAgrupadorMensagens = _elementoAlerta.find('.alt-alerta-flutuante-label-agrupador-mensagens').eq(0);
        var _elementoAgrupadorMensagens = _elementoAlerta.find('.alt-alerta-flutuante-agrupador-mensagens').eq(0);
        var _promessaTimeoutAlerta = null;
        var _promessaTimeoutBlanket = null;

        var _escondeAlerta = function() {
          $timeout.cancel(_promessaTimeoutAlerta);
          $timeout.cancel(_promessaTimeoutBlanket);

          _elementoAlerta.off('mouseenter');
          _elementoAlerta.off('mouseleave');

          _elementoBlanket.fadeOut(TEMPO_DE_REMOCAO);
          _elementoAlerta.fadeOut(TEMPO_DE_REMOCAO);

          scope._sendoExibido = false;
        };

        _elementoLabelAgrupadorMensagens.on('click', function() {
          _elementoAgrupadorMensagens.toggleClass('hidden');
        });

        scope._sendoExibido = false;

        scope.sendoExibido = function() {
          return scope._sendoExibido;
        };

        $rootScope.$on(AltAlertaFlutuanteEventos.EVENTO_ALERTA_FLUTUANTE, function(evento, obj) {
          scope._sendoExibido = true;

          _elementoAlerta.off('mouseenter');
          _elementoAlerta.off('mouseleave');

          var _attrStyle = _elementoAlerta.attr('style');
          var _estaAparecendo = _attrStyle ? _attrStyle.match('block') : true;
          var _estaSumindo = _attrStyle ? _attrStyle.match('opacity') : false;
          var _obj = ng.isObject(obj) ? obj : {};

          scope.titulo = _obj.titulo || TITULO_DEFAULT;
          scope.mensagem = $sce.trustAsHtml(_obj.msg || MENSAGEM_DEFAULT);
          scope.tipo = _obj.tipo || ESTILO_ALERTA_DEFAULT;
          scope.icone = _obj.icone || ICONE_DEFAULT;
          scope.tempoVisivel = _obj.tempoVisivel || TEMPO_DE_EXIBICAO;
          scope.exibeBtnClose = ng.isDefined(_obj.exibeBtnClose) ? _obj.exibeBtnClose : true;
          scope.comBlanket = ng.isDefined(_obj.comBlanket) ? _obj.comBlanket : false;
          scope.corBarraTempo = COR_TEMPO_DANGER;
          scope.listaMsg = _obj.listaMsg || [];

          switch (scope.tipo) {
            case "danger":
              scope.corBarraTempo = COR_TEMPO_DANGER;
              break;

            case "success":
              scope.corBarraTempo = COR_TEMPO_SUCCESS;
              break;

            case "info":
              scope.corBarraTempo = COR_TEMPO_INFO;
              break;

            case "warning":
              scope.corBarraTempo = COR_TEMPO_WARNING;
              break;
          }

          _elementoAlerta.on('mouseenter', function() {
            _elementoTempo.css({
              'transition': 'none',
              'width': '100%'
            });

            $timeout.cancel(_promessaTimeoutAlerta);
            $timeout.cancel(_promessaTimeoutBlanket);
          });

          _elementoAlerta.on('mouseleave', function() {
            _elementoTempo.css({
              'transition': 'width ' + scope.tempoVisivel + 'ms ease',
              'width': '0'
            });

            _elementoAlerta.fadeIn(TEMPO_DE_APARICAO);

            _promessaTimeoutAlerta = $timeout(function() {
              _elementoAlerta.fadeOut(TEMPO_DE_REMOCAO);
            }, scope.tempoVisivel);

            if (scope.comBlanket) {
              _elementoBlanket.fadeIn(TEMPO_DE_APARICAO);

              _promessaTimeoutBlanket = $timeout(function() {
                _elementoBlanket.fadeOut(TEMPO_DE_REMOCAO);
              }, scope.tempoVisivel);
            }
          });

          if (!_estaAparecendo  && !_estaSumindo) {
            _elementoAlerta.fadeIn(TEMPO_DE_APARICAO);

            _elementoTempo.css({
              'width': '100%',
              'transition': 'none'
            });

            $timeout(function() {
              _elementoTempo.css({
                'transition': 'width ' + scope.tempoVisivel + 'ms ease',
                'width': '0'
              });

              _promessaTimeoutAlerta = $timeout(function() {
                _elementoAlerta.fadeOut(TEMPO_DE_REMOCAO);
              }, scope.tempoVisivel);

              if (scope.comBlanket) {
                _elementoBlanket.fadeIn(TEMPO_DE_APARICAO);

                _promessaTimeoutBlanket = $timeout(function() {
                  _elementoBlanket.fadeOut(TEMPO_DE_REMOCAO);
                }, scope.tempoVisivel);
              }
            }, TEMPO_INICIALIZACAO_BARRA_TEMPO);
          }
        });

        _elementoClose.on('click', _escondeAlerta);
        $rootScope.$on(AltAlertaFlutuanteEventos.EVENTO_ESCONDER_ALERTA_FLUTUANTE, _escondeAlerta);
      }

      return {
        restrict: 'A',
        replace: true,
        scope: {},
        template: TEMPLATE,
        link: _link
      };
    }]);
}(window.angular));
