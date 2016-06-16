(function () {
  'use strict';

  describe('Feeds List Controller Tests', function () {
    // Initialize global variables
    var FeedsListController,
      $scope,
      $httpBackend,
      $state,
      $location,
      Authentication,
      FeedsService,
      mockFeed;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData : function (util, customEqualityTesters) {
          return {
            compare : function (actual, expected) {
              return {
                pass : angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _FeedsService_, _$location_) {
        // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      $location = _$location_;
      Authentication = _Authentication_;
      FeedsService = _FeedsService_;

      //$urlRouterProvider = _$urlRouterProvider_;
      //$urlRouterProvider.deferIntercept();

        // create mock article
      mockFeed = new FeedsService({
        _id : '525a8422f6d0f87f0e407a33',
        name : 'Feed Name',
        url : 'Feed URL'
      });

        // Mock logged in user
      Authentication.user = {
        roles : ['user']
      };

      // Initialize the Feeds List controller.
      FeedsListController = $controller('FeedsListController', {
        $scope : $scope
      });

        //Spy on state go
      spyOn($state, 'go');
    }));

    it('FeedsListController should exist', function () {
      expect(FeedsListController).toBeDefined();
    });

    it('Should include CRUD methods', function () {
      expect($scope.find).toBeDefined();
      expect($scope.addCannel).toBeDefined();
      expect($scope.delCannel).toBeDefined();
      expect($scope.show).toBeDefined();
      expect($scope.show_item).toBeDefined();
    });

    //$scope.find()
    describe('$scope.find()', function () {
      it('$scope.find() should create an array with at least one feed object fetched from XHR', inject(function (FeedsService) {
          // Create a sample Feeds array that includes the new feed
        var sampleFeeds = [mockFeed];

        // expect a get request to 'api/feeds'
        // Set GET response to sampleFeeds
        //console.log('sampleFeeds - ' + sampleFeeds);
        $httpBackend.expectGET('api/feeds').respond(sampleFeeds);

        // Run controller functionality
        $scope.find();
        $httpBackend.flush();

          // Test scope value
        expect($scope.feeds).toEqualData(sampleFeeds);
      }));
    });

    //$scope.addCannel
    describe('$scope.addCannel()', function () {
      var sampleFeedPostData;
      var sampleFeeds = [mockFeed];
      
      beforeEach(function () {
        // Create a sample Feed object
        sampleFeedPostData = new FeedsService({
          //_id : '525a8422f6d0f87f0e407a33',
          name : 'Feed Name',
          url : 'Feed URL'
        });

        // Fixture mock form input values
        $scope.nameChannel = 'Feed Name';
        $scope.urlChannel = 'Feed URL';

        //spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then GET list new object', inject(function (FeedsService) {
        // Set expect response
        $httpBackend.expectPOST('api/feeds', sampleFeedPostData).respond(mockFeed);
        $httpBackend.expectGET('api/feeds').respond(sampleFeeds);
        
        // Run controller functionality
        $scope.addCannel(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.nameChannel).toEqual('');
        expect($scope.urlChannel).toEqual('');

      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/feeds', sampleFeedPostData).respond(400, {
          message : errorMessage
        });

        $scope.addCannel(true);
        $httpBackend.flush();

        expect($scope.error).toBe(errorMessage);
      });
    });
    
    //$scope.delCannel
    describe('$scope.delCannel()', function () {
      
      beforeEach(function () {
        $scope.feeds = [mockFeed, {}];
        $httpBackend.expectDELETE(/api\/feeds\/([0-9a-fA-F]{24})$/).respond(204);
        $scope.delCannel($scope.feeds[0]);
        $httpBackend.flush();
      });
      
      it('should send a DELETE request with a valid feedsId and remove the feed from the $scope.feeds', inject(function (FeedsService) {
        expect($scope.feeds.length).toBe(1);
      }));
      
    });
    
    //$scope.show
    describe('$scope.show()', function () {
 
      beforeEach(function () {
        $scope.feeds = [mockFeed, {}];
      });
      
      it('should send a GET request to http://ajax.googleapis.com/ajax/services/feed/load?callback=JSON_CALLBACK&num=20&q=Feed+URL&v=1.0', inject(function (FeedsService) {
        $httpBackend.expect('JSONP', 'http://ajax.googleapis.com/ajax/services/feed/load?callback=JSON_CALLBACK&num=20&q=Feed+URL&v=1.0').respond({ 'responseData': { 'feed':{ 'feedUrl':'http://censor.net.ua/includes/news_ru.xml','title':'Цензор.НЕТ - Новости','link':'http://censor.net.ua/','author':'','description':'Ежеминутные обновления: Новости Украины и мира, видео, фоторепортажи, форум без регистрации, анекдоты, цитаты, фото приколы','type':'rss20','entries':[{ 'title':'Кабмин не принимал решение о повышении тарифов на газ для населения с 1 апреля, - Розенко','link':'http://censor.net.ua/news/381850/kabmin_ne_prinimal_reshenie_o_povyshenii_tarifov_na_gaz_dlya_naseleniya_s_1_aprelya_rozenko','author':'','publishedDate':'Wed, 30 Mar 2016 05:45:58 -0700','contentSnippet':'Министр социальной политики Павел Розенко заявляет об отсутствии решения Кабинета Министров о повышении тарифов на природный ...','content':'Министр социальной политики Павел Розенко заявляет об отсутствии решения Кабинета Министров о повышении тарифов на природный газ для населения с 1 апреля.','categories':['Политика Украины'] },{ 'title':'Яценюк поручил предусмотреть повышение соцстандартов в 2017 году на 10%','link':'http://censor.net.ua/news/381846/yatsenyuk_poruchil_predusmotret_povyshenie_sotsstandartov_v_2017_godu_na_10','author':'','publishedDate':'Wed, 30 Mar 2016 05:41:46 -0700','contentSnippet':'В основных направлениях бюджетной политики на следующий год необходимо предусмотреть  рост социальных стандартов будет на 2% ...','content':'В основных направлениях бюджетной политики на следующий год необходимо предусмотреть  рост социальных стандартов будет на 2% выше запланированной инфляции на уровне 8%.','categories':['Экономика'] },{ 'title':'Российский \'суд\' отклонил жалобу на приговор активистке Полюдовой, выступавшей против войны в Украине','link':'http://censor.net.ua/news/381848/rossiyiskiyi_sud_otklonil_jalobu_na_prigovor_aktivistke_polyudovoyi_vystupavsheyi_protiv_voyiny_v_ukraine','author':'','publishedDate':'Wed, 30 Mar 2016 05:41:07 -0700','contentSnippet':'В Краснодарском крае суд признал законным приговор активистке Дарье Полюдовой, осужденной по обвинению в призывах к ...','content':'В Краснодарском крае суд признал законным приговор активистке Дарье Полюдовой, осужденной по обвинению в призывах к экстремистской деятельности и сепаратизму к двум годам колонии-поселения.','categories':['За рубежом'] },{ 'title':'\'Найдите сейчас быстро министра. Это 40 млн грн на АТО\', - Яценюк поручил срочно найти Абромавичуса','link':'http://censor.net.ua/news/381847/nayidite_seyichas_bystro_ministra_eto_40_mln_grn_na_ato_yatsenyuk_poruchil_srochno_nayiti_abromavichusa','author':'','publishedDate':'Wed, 30 Mar 2016 05:40:59 -0700','contentSnippet':'Премьер-министр Арсений Яценюк поручил заместителю министра экономического развития и торговли Максиму Нефедову до конца ...','content':'Премьер-министр Арсений Яценюк поручил заместителю министра экономического развития и торговли Максиму Нефедову до конца заседания правительства, проходящего сегодня в Киеве, найти главу Минэкономразвития Айвараса Абромавичуса, для утверждения решения о выделении 40 млн грн на закупку автомобильного транспорта для АТО.','categories':['Политика Украины'] },{ 'title':'58 сотрудников СБУ были люстрированы, - Ткачук','link':'http://censor.net.ua/news/381845/58_sotrudnikov_sbu_byli_lyustrirovany_tkachuk','author':'','publishedDate':'Wed, 30 Mar 2016 05:33:32 -0700','contentSnippet':'Люстрационной проверке подлежат более 17 тысяч сотрудников Службы безопасности Украины. В отношении 7 тысяч СБУшников проверка ...','content':'Люстрационной проверке подлежат более 17 тысяч сотрудников Службы безопасности Украины. В отношении 7 тысяч СБУшников проверка завершена.','categories':['Политика Украины'] },{ 'title':'Глобусы с российским Крымом продают в белорусском Могилеве. ФОТОрепортаж','link':'http://censor.net.ua/photo_news/381844/globusy_s_rossiyiskim_krymom_prodayut_v_belorusskom_mogileve_fotoreportaj','author':'','publishedDate':'Wed, 30 Mar 2016 05:33:02 -0700','contentSnippet':'В универмаге города Могилев (Беларусь) продают глобусы, на которых Крым является территорией России, а не Украины.','content':'В универмаге города Могилев (Беларусь) продают глобусы, на которых Крым является территорией России, а не Украины.','categories':['Политика Украины'] },{ 'title':'Гройсман в состоянии говорить \'нет\', в том числе Порошенко, - Ложкин','link':'http://censor.net.ua/news/381842/groyisman_v_sostoyanii_govorit_net_v_tom_chisle_poroshenko_lojkin','author':'','publishedDate':'Wed, 30 Mar 2016 05:18:19 -0700','contentSnippet':'Глава Администрации президента Борис Ложкин уверяет, что спикер Верховной Рады Владимир Гройсман - самостоятельный политический ...','content':'Глава Администрации президента Борис Ложкин уверяет, что спикер Верховной Рады Владимир Гройсман - самостоятельный политический игрок.','categories':['Политика Украины'] },{ 'title':'Новому генпрокурору придется восстанавливать доверие общества к ГПУ, - Горбатюк','link':'http://censor.net.ua/news/381841/novomu_genprokuroru_pridetsya_vosstanavlivat_doverie_obschestva_k_gpu_gorbatyuk','author':'','publishedDate':'Wed, 30 Mar 2016 05:17:03 -0700','contentSnippet':'Новому генеральному прокурору (независимо от того, кто им станет) придется сначала восстанавливать доверие общества к ГПУ.','content':'Новому генеральному прокурору (независимо от того, кто им станет) придется сначала восстанавливать доверие общества к ГПУ.','categories':['Политика Украины'] },{ 'title':'Холодницкий просит Раду дать разрешение на арест судьи Бурана, стрелявшего в детективов НАБУ','link':'http://censor.net.ua/news/381843/holodnitskiyi_prosit_radu_dat_razreshenie_na_arest_sudi_burana_strelyavshego_v_detektivov_nabu','author':'','publishedDate':'Wed, 30 Mar 2016 05:13:19 -0700','contentSnippet':'Руководитель Специализированной антикоррупционной прокуратуры Назар Холодницкий направил в Верховную Раду и председателю ...','content':'Руководитель Специализированной антикоррупционной прокуратуры Назар Холодницкий направил в Верховную Раду и председателю Верховного Суда представление о предоставлении согласия на задержание, избрание меры пресечения в виде содержания под стражей одесского судьи, который вчера открыл стрельбу по детективам Антикоррупционного бюро и антикоррупционным прокурорам.','categories':['Происшествия'] },{ 'title':'Кабмин выделил 43 млн. грн на закупку спецавтомобилей для полицейских патрулей в Донецкой и Луганской области, - Аваков','link':'http://censor.net.ua/news/381840/kabmin_vydelil_43_mln_grn_na_zakupku_spetsavtomobileyi_dlya_politseyiskih_patruleyi_v_donetskoyi_i_luganskoyi','author':'','publishedDate':'Wed, 30 Mar 2016 05:09:53 -0700','contentSnippet':'Соответствующее решение было принято на заседании Кабинета Министров в среду, 30 марта.','content':'Соответствующее решение было принято на заседании Кабинета Министров в среду, 30 марта.','categories':['Происшествия'] },{ 'title':'\'Сейчас пытаются перекупить народных депутатов, которые входили в другие фракции\', - нардеп \'Батькивщины\' Крулько о формировании коалиции','link':'http://censor.net.ua/news/381839/seyichas_pytayutsya_perekupit_narodnyh_deputatov_kotorye_vhodili_v_drugie_fraktsii_nardep_batkivschiny','author':'','publishedDate':'Wed, 30 Mar 2016 05:09:36 -0700','contentSnippet':'Парламентские фракции \'Блок Петра Порошенко\' (БПП) и \'Народный фронт\' пытаются перекупить депутатов из других фракций для ...','content':'Парламентские фракции \'Блок Петра Порошенко\' (БПП) и \'Народный фронт\' пытаются перекупить депутатов из других фракций для создания коалиции.','categories':['Политика Украины'] },{ 'title':'Гройсман предложил внефракционным нардепам войти в БПП, - нардеп Кишкар','link':'http://censor.net.ua/news/381838/groyisman_predlojil_vnefraktsionnym_nardepam_voyiti_v_bpp_nardep_kishkar','author':'','publishedDate':'Wed, 30 Mar 2016 05:04:02 -0700','contentSnippet':'Депутат Павел Кишкар сообщил, что ему и другим внефракционным депутатам предложили войти во фракцию БПП.','content':'Депутат Павел Кишкар сообщил, что ему и другим внефракционным депутатам предложили войти во фракцию БПП.','categories':['Политика Украины'] },{ 'title':'В украинскую школьную программу добавят уроки крымскотатарской литературы','link':'http://censor.net.ua/news/381837/v_ukrainskuyu_shkolnuyu_programmu_dobavyat_uroki_krymskotatarskoyi_literatury','author':'','publishedDate':'Wed, 30 Mar 2016 05:01:20 -0700','contentSnippet':'В школьный курс украинской литературы добавят часы для изучения крымскотатарской литературы.','content':'В школьный курс украинской литературы добавят часы для изучения крымскотатарской литературы.','categories':['Политика Украины'] },{ 'title':'\'Жертвы многочисленны, но армии РФ там нет\', - пресс-секретарь Путина - украинскому журналисту на вопрос о количестве погибших россиян на Донбассе. ВИДЕО','link':'http://censor.net.ua/video_news/381836/jertvy_mnogochislenny_no_armii_rf_tam_net_presssekretar_putina_ukrainskomu_jurnalistu_na_vopros_o_kolichestve','author':'','publishedDate':'Wed, 30 Mar 2016 04:58:50 -0700','contentSnippet':'Пресс-секретарь главы РФ Дмитрий Песков не дал ответ на вопрос украинского журналиста Романа Цимбалюка о количестве погибших на ...','content':'Пресс-секретарь главы РФ Дмитрий Песков не дал ответ на вопрос украинского журналиста Романа Цимбалюка о количестве погибших на Донбассе россиян.','categories':['Общество'] },{ 'title':'Гройсман внес на рассмотрение комитета ВР законопроект, позволяющий Миклошу работать в новом Кабмине без получения гражданства и прохождения спецпроверки. ДОКУМЕНТ','link':'http://censor.net.ua/news/381834/groyisman_vnes_na_rassmotrenie_komiteta_vr_zakonoproekt_pozvolyayuschiyi_mikloshu_rabotat_v_novom_kabmine','author':'','publishedDate':'Wed, 30 Mar 2016 04:57:23 -0700','contentSnippet':'Спикер Верховной Рады Владимир Гройсман внес на рассмотрение Комитета ВР по вопросам правовой политики и правосудия ...','content':'Спикер Верховной Рады Владимир Гройсман внес на рассмотрение Комитета ВР по вопросам правовой политики и правосудия законопроект №4333 \'Про внесення змін до деякіх законів України щодо залучення до складу Уряду антикризових менеджерів у сфері фінансів\'.','categories':['Политика Украины'] },{ 'title':'Кабмин отменил действие соглашения с РФ о сотрудничестве в техзащите информации','link':'http://censor.net.ua/news/381833/kabmin_otmenil_deyistvie_soglasheniya_s_rf_o_sotrudnichestve_v_tehzaschite_informatsii','author':'','publishedDate':'Wed, 30 Mar 2016 04:51:24 -0700','contentSnippet':'Кабинет Министров принял решение отменить действие соглашения с правительством России о сотрудничестве в сфере технической ...','content':'Кабинет Министров принял решение отменить действие соглашения с правительством России о сотрудничестве в сфере технической защиты информации.','categories':['Общество'] },{ 'title':'Семь полицейских попали в больницу в результате драки с янтарокопателями на Ривненщине, - Нацполиция','link':'http://censor.net.ua/news/381832/sem_politseyiskih_popali_v_bolnitsu_v_rezultate_draki_s_yantarokopatelyami_na_rivnenschine_natspolitsiya','author':'','publishedDate':'Wed, 30 Mar 2016 04:48:19 -0700','contentSnippet':'В результате драки со старателями янтаря в Ривненской области 7 полицейских получили телесные повреждения.','content':'В результате драки со старателями янтаря в Ривненской области 7 полицейских получили телесные повреждения.','categories':['Происшествия'] },{ 'title':'Бойцам 1-го батальона 54 бригады нужны тепловизоры, - волонтеры \'Вернись живым\'','link':'http://censor.net.ua/news/381831/boyitsam_1go_batalona_54_brigady_nujny_teplovizory_volontery_vernis_jivym','author':'','publishedDate':'Wed, 30 Mar 2016 04:42:18 -0700','contentSnippet':'Военнослужащим 1-го батальона 54 бригады, которые несут службу на Дебальцевском направлении в зоне АТО, нужны тепловизоры.','content':'Военнослужащим 1-го батальона 54 бригады, которые несут службу на Дебальцевском направлении в зоне АТО, нужны тепловизоры.','categories':['Общество'] },{ 'title':'\'С трибун на наши головы летел мусор\', - российская волейболистка Кошелева об инциденте в Турции','link':'http://censor.net.ua/news/381830/s_tribun_na_nashi_golovy_letel_musor_rossiyiskaya_voleyibolistka_kosheleva_ob_intsidente_v_turtsii','author':'','publishedDate':'Wed, 30 Mar 2016 04:35:10 -0700','contentSnippet':'Представительниц волейбольной команды \'Динамо\' (Краснодар) на игре в Турции с командой \'Галатасарай\' (Стамбул) забросали ...','content':'Представительниц волейбольной команды \'Динамо\' (Краснодар) на игре в Турции с командой \'Галатасарай\' (Стамбул) забросали мусором.','categories':['За рубежом'] },{ 'title':'Адвоката Грабовского похоронят в Киеве 2 апреля','link':'http://censor.net.ua/news/381829/advokata_grabovskogo_pohoronyat_v_kieve_2_aprelya','author':'','publishedDate':'Wed, 30 Mar 2016 04:34:22 -0700','contentSnippet':'Убитого адвоката российского ГРУшника Александра Александрова Юрия Грабовского похоронят в Киеве на Лесном кладбище 2 апреля.','content':'Убитого адвоката российского ГРУшника Александра Александрова Юрия Грабовского похоронят в Киеве на Лесном кладбище 2 апреля.','categories':['Общество'] }] } }, 'responseDetails': null, 'responseStatus': 200 });
        $scope.show($scope.feeds[0]);
        $httpBackend.flush();
      }));
      
    });
    
    //$scope.show_item
    describe('$scope.show_item()', function () {
      var item;
      
      beforeEach(function () {
        item = {
          author: 'item_author',
          content: 'item_content'
        };
      });
      
      it('$scope.author and $scope.content should be defined' , function () {
        $scope.show_item(item);
        expect($scope.author).toBeDefined();
        expect($scope.content).toBeDefined();
        expect($scope.chartObject).toBeDefined();
      }); 
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
    
  });
})();
