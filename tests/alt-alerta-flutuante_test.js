describe('altAlertaFlutuanteDirective', function() {
  var _rootScope, _scope, _compile, _timeoutMock, _element, _alerta, _blanket, _AltAlertaFlutuanteEventos, _AltAlertaFlutuanteService;
  var EVENTO = "alt.exibe-alerta-flutuante";
  var EVENTO_ESCONDER = "alt.esconde-alerta-flutuante";
  var TROCA_ROTA = "$locationChangeSuccess";
  var TEMPO_DE_EXIBICAO = 10000;
  var TEMPO_DE_REMOCAO = 33;
  var TEMPO_INICIALIZACAO_BARRA_TEMPO = 1000;

  beforeEach(module('alt.alerta-flutuante'));

  beforeEach(inject(function($injector) {
      _rootScope = $injector.get('$rootScope');
      _scope = _rootScope.$new();
      _compile = $injector.get('$compile');
      _timeoutMock = $injector.get('$timeout');
      _AltAlertaFlutuanteEventos = $injector.get('AltAlertaFlutuanteEventos');
      _AltAlertaFlutuanteService = $injector.get('AltAlertaFlutuanteService');

      var _html = '<div alt-alerta-flutuante></div>';

      _element = angular.element(_html);
      _compile(_element)(_scope);
      _scope.$digest();

      spyOn(_rootScope, '$broadcast').and.callThrough();
      spyOn(_timeoutMock, 'cancel').and.callThrough();

      _alerta = _element.find('#alt-alerta-flutuante');
      _blanket = _element.find('#alt-alerta-flutuante-blanket');
      _tempo = _element.find('#alt-alerta-flutuante-tempo');
      _close = _alerta.find('.close').eq(0);

      spyOn(_alerta, 'off').and.callFake(angular.noop);
      spyOn(_tempo, 'css').and.callFake(angular.noop);
    }));

  describe('service', function() {
    it('deve ter o service como um objeto', function() {
        expect(typeof _AltAlertaFlutuanteService).toBe('object');
    });

    it('exibe - deve chamar o $rootScope.$broadcast com os parâmetros corretos', function() {
        var _opcoes = {a: true};
        _AltAlertaFlutuanteService.exibe(_opcoes);

        expect(_rootScope.$broadcast).toHaveBeenCalledWith('alt.exibe-alerta-flutuante', _opcoes);
    });

    it('esconde - deve chamar o $rootScope.$broadcast com os parâmetros corretos', function() {
        var _opcoes = {a: true};
        _AltAlertaFlutuanteService.esconde(_opcoes);

        expect(_rootScope.$broadcast).toHaveBeenCalledWith('alt.esconde-alerta-flutuante', _opcoes);
    });
  });

  describe('diretiva', function() {

    describe('criação', function() {
      it('deve ter element criado e acessível', function() {
        expect(_element).toBeDefined();
      })

      it('deve ter alerta criado e acessível', function() {
        expect(_alerta).toBeDefined();
      })

      it('deve ter blanket criado e acessível', function() {
        expect(_blanket).toBeDefined();
      })

      it('deve ter tempo criado e acessível', function() {
        expect(_tempo).toBeDefined();
      })

      it('deve ter close criado e acessível', function() {
        expect(_close).toBeDefined();
      })

      it('deve ter o element invisível', function() {
        expect(_alerta.attr('style').match('none')).toBeTruthy();
      })

      it('deve ter os valores corretos para as constantes', function() {
        expect(_AltAlertaFlutuanteEventos.EVENTO_ALERTA_FLUTUANTE).toEqual('alt.exibe-alerta-flutuante');
        expect(_AltAlertaFlutuanteEventos.EVENTO_ESCONDER_ALERTA_FLUTUANTE).toEqual('alt.esconde-alerta-flutuante');
        expect(_AltAlertaFlutuanteEventos.TROCA_ROTA).toEqual('$locationChangeSuccess');
      })
    })

    describe('reação ao click de fechar', function() {
      it('deve sumir com o alerta', function() {
        spyOn($.fn, 'fadeOut').and.callThrough();

        _close.click();

        expect(_timeoutMock.cancel).toHaveBeenCalled();
        expect(_alerta.fadeOut).toHaveBeenCalledWith(TEMPO_DE_REMOCAO);
      })
    })

    describe('reação ao $broadcast - exibir alerta', function() {
      it('não deve chamar os métodos de aparição do alert, o elemento já está sendo exibido - block', function() {
        spyOn($.fn, 'fadeIn').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        _alerta = _alerta.attr('style', 'display: block');

        _rootScope.$broadcast(EVENTO);

        expect($.fn.fadeIn).not.toHaveBeenCalled();
        expect($.fn.fadeOut).not.toHaveBeenCalled();

      })

      it('não deve chamar os métodos de aparição do alert, o elemento já está sendo exibido - opacity', function() {
        spyOn($.fn, 'fadeIn').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        _alerta = _alerta.attr('style', 'opacity: .94545454');

        _rootScope.$broadcast(EVENTO);

        expect($.fn.fadeIn).not.toHaveBeenCalled();
        expect($.fn.fadeOut).not.toHaveBeenCalled();

      })

      it('não deve chamar os métodos de aparição do alert, o elemento já está sendo exibido - block e opacity', function() {
        spyOn($.fn, 'fadeIn').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        _alerta = _alerta.attr('style', 'display: block; opacity: .94545454;');

        _rootScope.$broadcast(EVENTO);

        expect($.fn.fadeIn).not.toHaveBeenCalled();
        expect($.fn.fadeOut).not.toHaveBeenCalled();
      })

      it('deve chamar os métodos de aparição do alert, o elemento não está sendo exibido', function() {
        spyOn($.fn, 'fadeIn').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        _alerta = _alerta.attr('style', 'display: none;');

        _rootScope.$broadcast(EVENTO);

        _timeoutMock.flush(TEMPO_INICIALIZACAO_BARRA_TEMPO);
        _timeoutMock.flush(TEMPO_DE_EXIBICAO);

        expect($.fn.fadeIn).toHaveBeenCalled();
        expect($.fn.fadeOut).toHaveBeenCalled();
      })

      it('deve chamar os métodos de aparição do alert, o elemento não está sendo exibido - com blanket', function() {
        spyOn($.fn, 'fadeIn').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        _alerta = _alerta.attr('style', 'display: none;');

        _rootScope.$broadcast(EVENTO, {comBlanket: true});

        _timeoutMock.flush(TEMPO_INICIALIZACAO_BARRA_TEMPO);
        _timeoutMock.flush(TEMPO_DE_EXIBICAO);

        expect($.fn.fadeIn).toHaveBeenCalled();
        expect($.fn.fadeOut).toHaveBeenCalled();
      })

      it('deve preencher o escopo com as propriedades default - tipo e mensagem', function() {
        _rootScope.$broadcast(EVENTO);

        expect(_element.isolateScope().tipo).toEqual("danger");
        expect(_element.isolateScope().titulo).toEqual("Houve um problema");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("Ocorreu um erro no momento da solicitação. Por favor, tente novamente mais tarde.");
        expect(_element.isolateScope().icone).toEqual("warning");
        expect(_element.isolateScope().tempoVisivel).toEqual(TEMPO_DE_EXIBICAO);
        expect(_element.isolateScope().exibeBtnClose).toEqual(true);
        expect(_element.isolateScope().comBlanket).toEqual(false);
        expect(_element.isolateScope().corBarraTempo).toEqual("#c56666");
      })

      it('deve preencher o escopo com o tipo default', function() {
        _rootScope.$broadcast(EVENTO, {msg: 'ae'});

        expect(_element.isolateScope().tipo).toEqual("danger");
        expect(_element.isolateScope().titulo).toEqual("Houve um problema");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("ae");
        expect(_element.isolateScope().icone).toEqual("warning");
        expect(_element.isolateScope().tempoVisivel).toEqual(TEMPO_DE_EXIBICAO);
        expect(_element.isolateScope().exibeBtnClose).toEqual(true);
        expect(_element.isolateScope().comBlanket).toEqual(false);
        expect(_element.isolateScope().corBarraTempo).toEqual("#c56666");
      })

      it('deve preencher o escopo com a mensagem default', function() {
        _rootScope.$broadcast(EVENTO, {tipo: 'success'});

        expect(_element.isolateScope().tipo).toEqual("success");
        expect(_element.isolateScope().titulo).toEqual("Houve um problema");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("Ocorreu um erro no momento da solicitação. Por favor, tente novamente mais tarde.");
        expect(_element.isolateScope().icone).toEqual("warning");
        expect(_element.isolateScope().tempoVisivel).toEqual(TEMPO_DE_EXIBICAO);
        expect(_element.isolateScope().exibeBtnClose).toEqual(true);
        expect(_element.isolateScope().comBlanket).toEqual(false);
        expect(_element.isolateScope().corBarraTempo).toEqual("#528c49");
      })

      it('deve preencher o titulo corretamente', function() {
        _rootScope.$broadcast(EVENTO, {msg: "abc", tipo: 'success', titulo: "titulo1"});

        expect(_element.isolateScope().tipo).toEqual("success");
        expect(_element.isolateScope().titulo).toEqual("titulo1");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("abc");
        expect(_element.isolateScope().icone).toEqual("warning");
        expect(_element.isolateScope().tempoVisivel).toEqual(TEMPO_DE_EXIBICAO);
        expect(_element.isolateScope().exibeBtnClose).toEqual(true);
        expect(_element.isolateScope().comBlanket).toEqual(false);
        expect(_element.isolateScope().corBarraTempo).toEqual("#528c49");
      })

      it('deve preencher o icone corretamente', function() {
        _rootScope.$broadcast(EVENTO, {msg: "abc", tipo: 'success', titulo: "titulo1", icone: 'check'});

        expect(_element.isolateScope().tipo).toEqual("success");
        expect(_element.isolateScope().titulo).toEqual("titulo1");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("abc");
        expect(_element.isolateScope().icone).toEqual("check");
        expect(_element.isolateScope().tempoVisivel).toEqual(TEMPO_DE_EXIBICAO);
        expect(_element.isolateScope().exibeBtnClose).toEqual(true);
        expect(_element.isolateScope().comBlanket).toEqual(false);
        expect(_element.isolateScope().corBarraTempo).toEqual("#528c49");
      })

      it('deve preencher o tempo corretamente', function() {
        var _novoTempoVisivel = 123;

        _rootScope.$broadcast(EVENTO, {msg: "abc", tipo: 'success', titulo: "titulo1", icone: 'check', tempoVisivel: _novoTempoVisivel});

        expect(_element.isolateScope().tipo).toEqual("success");
        expect(_element.isolateScope().titulo).toEqual("titulo1");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("abc");
        expect(_element.isolateScope().icone).toEqual("check");
        expect(_element.isolateScope().tempoVisivel).not.toEqual(TEMPO_DE_EXIBICAO);
        expect(_element.isolateScope().tempoVisivel).toEqual(_novoTempoVisivel);
        expect(_element.isolateScope().comBlanket).toEqual(false);
        expect(_element.isolateScope().exibeBtnClose).toEqual(true);
        expect(_element.isolateScope().comBlanket).toEqual(false);
        expect(_element.isolateScope().corBarraTempo).toEqual("#528c49");
      })

      it('deve preencher o exibeBtnClose corretamente', function() {
        var _novoTempoVisivel = 123;

        _rootScope.$broadcast(EVENTO, {msg: "abc", tipo: 'success', titulo: "titulo1", icone: 'check', tempoVisivel: _novoTempoVisivel, exibeBtnClose: false});

        expect(_element.isolateScope().tipo).toEqual("success");
        expect(_element.isolateScope().titulo).toEqual("titulo1");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("abc");
        expect(_element.isolateScope().icone).toEqual("check");
        expect(_element.isolateScope().tempoVisivel).not.toEqual(TEMPO_DE_EXIBICAO);
        expect(_element.isolateScope().tempoVisivel).toEqual(_novoTempoVisivel);
        expect(_element.isolateScope().exibeBtnClose).toEqual(false);
        expect(_element.isolateScope().comBlanket).toEqual(false);
        expect(_element.isolateScope().corBarraTempo).toEqual("#528c49");
      })

      it('deve preencher o exibeBtnClose corretamente - tipo: info', function() {
        var _novoTempoVisivel = 123;

        _rootScope.$broadcast(EVENTO, {msg: "abc", tipo: 'info', titulo: "titulo1", icone: 'check', tempoVisivel: _novoTempoVisivel, exibeBtnClose: false});

        expect(_element.isolateScope().tipo).toEqual("info");
        expect(_element.isolateScope().titulo).toEqual("titulo1");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("abc");
        expect(_element.isolateScope().icone).toEqual("check");
        expect(_element.isolateScope().tempoVisivel).not.toEqual(TEMPO_DE_EXIBICAO);
        expect(_element.isolateScope().tempoVisivel).toEqual(_novoTempoVisivel);
        expect(_element.isolateScope().exibeBtnClose).toEqual(false);
        expect(_element.isolateScope().comBlanket).toEqual(false);
        expect(_element.isolateScope().corBarraTempo).toEqual("#31708f");
      })

      it('deve preencher o exibeBtnClose corretamente - tipo: danger', function() {
        var _novoTempoVisivel = 123;

        _rootScope.$broadcast(EVENTO, {msg: "abc", tipo: 'danger', titulo: "titulo1", icone: 'check', tempoVisivel: _novoTempoVisivel, exibeBtnClose: false});

        expect(_element.isolateScope().tipo).toEqual("danger");
        expect(_element.isolateScope().titulo).toEqual("titulo1");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("abc");
        expect(_element.isolateScope().icone).toEqual("check");
        expect(_element.isolateScope().tempoVisivel).not.toEqual(TEMPO_DE_EXIBICAO);
        expect(_element.isolateScope().tempoVisivel).toEqual(_novoTempoVisivel);
        expect(_element.isolateScope().exibeBtnClose).toEqual(false);
        expect(_element.isolateScope().comBlanket).toEqual(false);
        expect(_element.isolateScope().corBarraTempo).toEqual("#c56666");
      })

      it('deve preencher o exibeBtnClose corretamente - tipo: warning', function() {
        var _novoTempoVisivel = 123;

        _rootScope.$broadcast(EVENTO, {msg: "abc", tipo: 'warning', titulo: "titulo1", icone: 'check', tempoVisivel: _novoTempoVisivel, exibeBtnClose: false});

        expect(_element.isolateScope().tipo).toEqual("warning");
        expect(_element.isolateScope().titulo).toEqual("titulo1");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("abc");
        expect(_element.isolateScope().icone).toEqual("check");
        expect(_element.isolateScope().tempoVisivel).not.toEqual(TEMPO_DE_EXIBICAO);
        expect(_element.isolateScope().tempoVisivel).toEqual(_novoTempoVisivel);
        expect(_element.isolateScope().exibeBtnClose).toEqual(false);
        expect(_element.isolateScope().comBlanket).toEqual(false);
        expect(_element.isolateScope().corBarraTempo).toEqual("#8a6d3b");
      })

      it('deve preencher o comBlanket corretamente', function() {
        var _novoTempoVisivel = 123;

        _rootScope.$broadcast(EVENTO, {msg: "abc", tipo: 'success', titulo: "titulo1", icone: 'check', tempoVisivel: _novoTempoVisivel, exibeBtnClose: false, comBlanket: true});

        expect(_element.isolateScope().tipo).toEqual("success");
        expect(_element.isolateScope().titulo).toEqual("titulo1");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("abc");
        expect(_element.isolateScope().icone).toEqual("check");
        expect(_element.isolateScope().tempoVisivel).not.toEqual(TEMPO_DE_EXIBICAO);
        expect(_element.isolateScope().tempoVisivel).toEqual(_novoTempoVisivel);
        expect(_element.isolateScope().exibeBtnClose).toEqual(false);
        expect(_element.isolateScope().comBlanket).toEqual(true);
        expect(_element.isolateScope().corBarraTempo).toEqual("#528c49");
      })
    })

    describe('reação ao $broadcast - esconder alerta', function() {
      it('deve sumir com o alerta', function() {
        spyOn($.fn, 'fadeOut').and.callThrough();

        _rootScope.$broadcast(EVENTO_ESCONDER);

        expect(_alerta.fadeOut).toHaveBeenCalledWith(TEMPO_DE_REMOCAO);
        expect(_blanket.fadeOut).toHaveBeenCalledWith(TEMPO_DE_REMOCAO);
      })
    })

    describe('reação ao $broadcast - esconder alerta - troca rota', function() {
      it('deve sumir com o alerta', function() {
        spyOn($.fn, 'fadeOut').and.callThrough();

        _rootScope.$broadcast(TROCA_ROTA);

        expect(_alerta.fadeOut).toHaveBeenCalledWith(TEMPO_DE_REMOCAO);
        expect(_blanket.fadeOut).toHaveBeenCalledWith(TEMPO_DE_REMOCAO);
      })
    })

    describe('reação ao mouseenter', function() {
      it('deve acionar as ações necessárias', function() {
        // todo(eric): implementar
      })
    })

    describe('reação ao mouseleave', function() {
        // todo(eric): implementar
    })
  })
});
