describe('altAlertaFlutuanteDirective', function() {
  var _rootScope, _scope, _compile, _element, _AltAlertaFlutuanteEventos;
  var EVENTO = "alt.exibe-alerta-flutuante";
  var EVENTO_ESCONDER = "alt.esconde-alerta-flutuante";

  beforeEach(module('alt.alerta-flutuante'));

  beforeEach(inject(function($injector) {
    _rootScope = $injector.get('$rootScope');
    _scope = _rootScope.$new();
    _compile = $injector.get('$compile');
    _AltAlertaFlutuanteEventos = $injector.get('AltAlertaFlutuanteEventos');

    var _html = '<div alt-alerta-flutuante></div>';

    _element = angular.element(_html);
    _compile(_element)(_scope);
    _scope.$digest();
  }));

  describe('criação', function() {
      it('deve ter element criado e acessível', function() {
          expect(_element).toBeDefined();
      })

      it('deve ter o element invisível', function() {
          expect(_element.find('#alerta-flutuante').attr('style').match('none')).toBeTruthy();
      })

      it('deve ter os valores corretos para as constantes', function() {
          expect(_AltAlertaFlutuanteEventos.EVENTO_ALERTA_FLUTUANTE).toEqual('alt.exibe-alerta-flutuante');
          expect(_AltAlertaFlutuanteEventos.EVENTO_ESCONDER_ALERTA_FLUTUANTE).toEqual('alt.esconde-alerta-flutuante');
      })
  })

  describe('reação ao click', function() {
      it('deve sumir com o alerta', function() {
          spyOn($.fn, 'stop').and.callThrough();
          spyOn($.fn, 'fadeOut').and.callThrough();

          var _alerta = _element.find('#alerta-flutuante');
          var _close = _element.find('#alerta-flutuante .close');

          _close.click();

          expect(_alerta.stop).toHaveBeenCalled();
          expect(_alerta.fadeOut).toHaveBeenCalledWith(99);
      })
  })

  describe('reação ao $broadcast - exibir alerta', function() {
      it('não deve chamar os métodos de aparição do alert, o elemento já está sendo exibido - block', function() {
          spyOn($.fn, 'fadeIn').and.callThrough();
          spyOn($.fn, 'delay').and.callThrough();
          spyOn($.fn, 'fadeOut').and.callThrough();

          _element = _element.find("#alerta-flutuante").attr('style', 'display: block');

          _rootScope.$broadcast(EVENTO);

          expect($.fn.fadeIn).not.toHaveBeenCalled();
          expect($.fn.delay).not.toHaveBeenCalled();
          expect($.fn.fadeOut).not.toHaveBeenCalled();

      })

      it('não deve chamar os métodos de aparição do alert, o elemento já está sendo exibido - opacity', function() {
        spyOn($.fn, 'fadeIn').and.callThrough();
        spyOn($.fn, 'delay').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        _element = _element.find("#alerta-flutuante").attr('style', 'opacity: .94545454');

        _rootScope.$broadcast(EVENTO);

        expect($.fn.fadeIn).not.toHaveBeenCalled();
        expect($.fn.delay).not.toHaveBeenCalled();
        expect($.fn.fadeOut).not.toHaveBeenCalled();

      })

      it('não deve chamar os métodos de aparição do alert, o elemento já está sendo exibido - block e opacity', function() {
        spyOn($.fn, 'fadeIn').and.callThrough();
        spyOn($.fn, 'delay').and.callThrough();
        spyOn($.fn, 'fadeOut').and.callThrough();

        _element = _element.find("#alerta-flutuante").attr('style', 'display: block; opacity: .94545454;');

        _rootScope.$broadcast(EVENTO);

        expect($.fn.fadeIn).not.toHaveBeenCalled();
        expect($.fn.delay).not.toHaveBeenCalled();
        expect($.fn.fadeOut).not.toHaveBeenCalled();
      })

      it('deve preencher o escopo com as propriedades default - tipo e mensagem', function() {
          _rootScope.$broadcast(EVENTO);

          expect(_element.isolateScope().tipo).toEqual("danger");
          expect(_element.isolateScope().titulo).toEqual("Houve um problema");
          expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("Ocorreu um erro no momento da solicitação. Por favor, tente novamente mais tarde.");
          expect(_element.isolateScope().icone).toEqual("warning");
      })

      it('deve preencher o escopo com o tipo default', function() {
        _rootScope.$broadcast(EVENTO, {msg: 'ae'});

        expect(_element.isolateScope().tipo).toEqual("danger");
        expect(_element.isolateScope().titulo).toEqual("Houve um problema");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("ae");
        expect(_element.isolateScope().icone).toEqual("warning");
      })

      it('deve preencher o escopo com a mensagem default', function() {
        _rootScope.$broadcast(EVENTO, {tipo: 'success'});

        expect(_element.isolateScope().tipo).toEqual("success");
        expect(_element.isolateScope().titulo).toEqual("Houve um problema");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("Ocorreu um erro no momento da solicitação. Por favor, tente novamente mais tarde.");
        expect(_element.isolateScope().icone).toEqual("warning");
      })

      it('deve preencher o titulo corretamente', function() {
        _rootScope.$broadcast(EVENTO, {msg: "abc", tipo: 'success', titulo: "titulo1"});

        expect(_element.isolateScope().tipo).toEqual("success");
        expect(_element.isolateScope().titulo).toEqual("titulo1");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("abc");
        expect(_element.isolateScope().icone).toEqual("warning");
      })

      it('deve preencher o icone corretamente', function() {
        _rootScope.$broadcast(EVENTO, {msg: "abc", tipo: 'success', titulo: "titulo1", icone: 'check'});

        expect(_element.isolateScope().tipo).toEqual("success");
        expect(_element.isolateScope().titulo).toEqual("titulo1");
        expect(_element.isolateScope().mensagem.$$unwrapTrustedValue()).toEqual("abc");
        expect(_element.isolateScope().icone).toEqual("check");
      })
  })

  describe('reação ao $broadcast - esconder alerta', function() {
      it('deve sumir com o alerta', function() {
          spyOn($.fn, 'stop').and.callThrough();
          spyOn($.fn, 'fadeOut').and.callThrough();

          var _alerta = _element.find('#alerta-flutuante');

          _rootScope.$broadcast(EVENTO_ESCONDER);

          expect(_alerta.stop).toHaveBeenCalled();
          expect(_alerta.fadeOut).toHaveBeenCalledWith(99);
      })
  })
});
