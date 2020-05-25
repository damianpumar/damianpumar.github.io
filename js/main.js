/*!
 * FullCoders v.1.4.2020+ (https://www.fullcoders.com)
 * Copyright 2020 FullCoders
 * Licensed under  ()
 */
'use strict';

var loader = {
  initialize: function initialize() {
    loader.show();

    $(window).load(function () {
      loader.hide();
    });
  },

  show: function show() {
    NProgress.start();
  },

  hide: function hide() {
    NProgress.done();
  }
};

// The magic number: 31557600000 is 24 * 3600 * 365.25 * 1000
// Which is the length of a year, the length of a year is 365 days and 6 hours
// which is 0.25 day.
var maginNumber = 31557600000;

var utilities = {
  loadImagesAsync: function loadImagesAsync() {

    var objects = document.getElementsByClassName("asyncImage");

    Array.from(objects).map(function (item) {
      var img = new Image();

      function applySrc(src) {
        return item.nodeName === "IMG" ? item.src = src : item.style.backgroundImage = "url(" + src + ")";
      }

      if (item.dataset.lowSrc) {
        applySrc(item.dataset.lowSrc);
      }

      img.src = item.dataset.src;

      img.onload = function () {
        item.classList.remove("asyncImage");
        return applySrc(item.dataset.src);
      };
    });
  },

  initializeHoursWorked: function initializeHoursWorked() {
    $(window).load(function () {
      var startWork = new Date(2011, 1, 1, 0, 0);
      var now = new Date();
      var daysDifference = now.getTime() - startWork.getTime();
      var yearsDifference = now.getYear() - startWork.getYear();
      //2 days * 24 hours per day * month * 12 month per year i not work and 15 days vacation
      var hoursNotWorked = (2 * 24 * 4 * 12 + 15) * yearsDifference;
      var hoursWorked = daysDifference / (1000 * 60 * 60 * 24) * 24 / 2.1 - hoursNotWorked;
      var hoursWorkedMask = Math.trunc(hoursWorked).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      $("#hoursWorked").text(hoursWorkedMask + " Working Hours");
    });
  },

  initializeAge: function initializeAge() {
    $(window).load(function () {
      var birthday = Date.parse("1991/11/06");
      var age = ~~((Date.now() - birthday) / maginNumber);

      $("#age").text(age + " years old");
    });
  },

  initializeFillBars: function initializeFillBars() {
    var initialized = false;

    window.addEventListener("pageChanged", function (e) {
      if (!initialized && e && e.detail == "resume") {
        $(".bar").each(function () {
          var bar = $(this);
          var percent = bar.attr("data-percent");
          var customMessage = bar.attr("data-message");
          var hastMessage = customMessage !== undefined;
          bar.find(".progress").css("width", percent + "%");

          if (hastMessage) {
            bar.find(".progress").html("<span style=\"width: auto; border-radius: 20%;\"> " + customMessage + " </span>");
          } else {
            bar.find(".progress").html("<span> " + percent + " </span>");
          }
        });
        initialized = true;
      }
    });
  },

  initializeStamp: function initializeStamp() {
    $(window).load(function () {
      console.clear();
      utilities.printStamp();
    });
  },

  printStamp: function printStamp() {
    if (window.location.href.includes("portfolio/")) {
      return;
    }

    var whereILive = $("#contact .fun-fact h4")[0].innerHTML;
    var myName = "【﻿Ｄａｍｉáｎ Ｐｕｍａｒ】";
    var myLastJob = $(".event p")[1].innerHTML.trim();
    var otherServer = utilities.getOtherServer();

    console.log("Sorry, I cleared console because I wanted show you this message below");
    console.log(myName);
    console.log("I live in " + whereILive);
    console.log(myLastJob);
    console.log("Code: https://github.com/damianpumar/myresume");
    console.log("Other server: " + otherServer);
    utilities.printSocialLinks();
  },

  printSocialLinks: function printSocialLinks() {

    var unique = function unique(value, index, self) {
      return self.indexOf(value) === index;
    };

    var socialLinks = [];

    $(".social a").each(function () {
      var link = $(this).attr("href");
      if (link.includes("http")) {
        socialLinks.push(link);
      }
    });

    socialLinks.filter(unique).forEach(function (link) {
      console.log("\u2022 " + link);
    });
  },

  getOtherServer: function getOtherServer() {
    var gitHubServer = "https://damianpumar.github.io";
    var ownServer = "https://damianpumar.com";
    return window.location.href.includes("github") ? ownServer : gitHubServer;
  },

  loadDownloadeableResume: function loadDownloadeableResume() {
    var additionalInformation = $(".only-for-cv-paper");
    additionalInformation.hide();

    $("#download-resume").click(function () {
      var resumeColor = $("#resume").css('background-color');
      var cv = $("#cv");
      cv.css('background-color', resumeColor);

      var opt = {
        filename: 'Damián Pumar - Resume',
        image: { type: 'jpeg', quality: 0.98 },
        jsPDF: { unit: 'pt', format: 'a3', orientation: 'portrait' },
        backgroundColor: resumeColor,
        pagebreak: { mode: ['ccs', "legacy"] }
      };

      $.blockUI({ message: '<h5>Creating CV...</h5>' });
      additionalInformation.show();

      html2pdf().set(opt).from(cv[0]).save().then(function () {
        additionalInformation.hide();
        $.unblockUI();
      });
    });
  }
};

var masonry = {
  initialize: function initialize() {
    $(window).on("resize debouncedresize", function () {
      masonry.refresh();
    });

    masonry.setup();
  },
  setup: function setup() {
    var masonryElement = $(".masonry");
    if (masonryElement.length) {
      masonryElement.each(function (index, el) {
        masonry.refresh();
        $(el).imagesLoaded(function () {
          $(el).isotope({
            layoutMode: $(el).data("layout") ? $(el).data("layout") : "masonry"
          });
          masonry.refresh();
        });

        if (!$(el).data("isotope")) {
          var filters = $(el).siblings(".filters");
          if (filters.length) {
            filters.find("a").on("click", function () {
              var selector = $(this).attr("data-filter");
              $(el).isotope({ filter: selector });
              $(this).parent().addClass("current").siblings().removeClass("current");
              return false;
            });
          }
        }
      });
    }
  },
  refresh: function refresh() {
    var masonry = $(".masonry");
    if (masonry.length) {
      masonry.each(function (index, el) {
        // check if isotope initialized
        if ($(el).data("isotope")) {
          var itemW = $(el).data("item-width");
          var containerW = $(el).width();
          var items = $(el).children(".hentry");
          var columns = Math.round(containerW / itemW);

          // set the widths (%) for each of item
          items.each(function (index, element) {
            var multiplier = $(this).hasClass("x2") && columns > 1 ? 2 : 1;
            var itemRealWidth = Math.floor(containerW / columns) * 100 / containerW * multiplier;
            $(this).css("width", itemRealWidth + "%");
          });

          var columnWidth = Math.floor(containerW / columns);

          $(el).isotope("option", { masonry: { columnWidth: columnWidth } });
          $(el).isotope("layout");
        }
      });
    }
  }
};

var current = 0;
var classicLayout = false;
var inClass, outClass, portfolioKeyword, portfolioActive;
window.nextAnimation = $("html").data("next-animation");
window.prevAnimation = $("html").data("prev-animation");
window.randomize = $("html").data("random-animation");
window.isAnimating = false;
var $main = $("#main"),
    $pages = $main.children(".pt-page"),
    $menuLinks = $(".nav-menu a"),
    animcursor = 1,
    endCurrPage = false,
    endNextPage = false,
    animEndEventNames = {
  WebkitAnimation: "webkitAnimationEnd",
  OAnimation: "oAnimationEnd",
  msAnimation: "MSAnimationEnd",
  animation: "animationend"
},
    animEndEventName = animEndEventNames[Modernizr.prefixed("animation")],
    support = Modernizr.cssanimations;
//-------------------
var page = {
  initialize: function initialize() {
    window.nextPage = function (index) {
      return new page.nextPage(index);
    };

    if ($("html").hasClass("one-page-layout")) {
      portfolioKeyword = $("section.portfolio").attr("id");

      var detailUrl = page.giveDetailUrl();

      classicLayout = $("html").attr("data-classic-layout") === "true";
      classicLayout = classicLayout || $("html").attr("data-mobile-classic-layout") === "true" && $(window).width() < 1025;
      classicLayout = classicLayout || !Modernizr.cssanimations;
      if (classicLayout) {
        $("html").addClass("classic-layout");
        page.setActivePage();
        $.address.change(function () {
          page.setActivePage();
          $("html").removeClass("is-menu-toggled-on");
        });
      } else {
        $("html").addClass("modern-layout");
        $.address.change(function () {
          page.setActivePage();
          $("html").removeClass("is-menu-toggled-on");
        });
      }

      $(".nav-menu a").on("click", function () {
        if (window.isAnimating) {
          return false;
        }
      });

      $.address.change(function () {
        var detailUrl = page.giveDetailUrl();
        if (detailUrl != -1) {
          page.showProjectDetails(detailUrl);
        } else {
          if ($.address.path().indexOf("/" + portfolioKeyword) != -1) {
            page.hideProjectDetails(true, false);
          }
        }
      });
    }

    $(".one-page-layout a.ajax").live("click", function () {
      var url = $(this).attr("href");
      var baseUrl = $.address.baseURL();
      if (url.indexOf(baseUrl) !== -1) {
        detailUrl = url.slice(baseUrl.length + 1);
        $.address.path("/" + detailUrl);
      } else {
        $.address.path(portfolioKeyword + "/" + url.replace(".html", ""));
      }
      return false;
    });
  },

  showProjectDetails: function showProjectDetails(url) {
    loader.show();
    if (!url.includes(".html")) url += ".html";

    var portfolio = $(".p-overlay:not(.active)").first();
    portfolioActive = $(".p-overlay.active");

    portfolio.empty().load("/portfolio/" + url + " .portfolio-single", function () {
      NProgress.set(0.5);

      portfolio.imagesLoaded(function () {
        masonry.setup();

        if (portfolioActive.length) {
          page.hideProjectDetails();
        }

        loader.hide();
        $("html").addClass("p-overlay-on");
        $("body").scrollTop(0);

        page.setup();

        if (classicLayout) {
          portfolio.show();
        } else {
          portfolio.removeClass("animate-in animate-out").addClass("animate-in").show();
        }
        portfolio.addClass("active");
      });

      $(".back").each(function (index, el) {
        $(el).attr("href", window.location.origin + "#portfolio");
      });
    });
  },

  setup: function setup() {
    masonry.setup();

    $(".tabs").each(function () {
      if (!$(this).find(".tab-titles li a.active").length) {
        $(this).find(".tab-titles li:first-child a").addClass("active");
        $(this).find(".tab-content > div:first-child").show();
      } else {
        $(this).find(".tab-content > div").eq($(this).find(".tab-titles li a.active").parent().index()).show();
      }
    });

    $(".tabs .tab-titles li a").on("click", function () {
      if ($(this).hasClass("active")) {
        return;
      }
      $(this).parent().siblings().find("a").removeClass("active");
      $(this).addClass("active");
      $(this).parents(".tabs").find(".tab-content > div").hide().eq($(this).parent().index()).show();
      return false;
    });
    var toggleSpeed = 300;
    $(".toggle h4.active + .toggle-content").show();

    $(".toggle h4").on("click", function () {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $(this).next(".toggle-content").stop(true, true).slideUp(toggleSpeed);
      } else {
        $(this).addClass("active");
        $(this).next(".toggle-content").stop(true, true).slideDown(toggleSpeed);

        if ($(this).parents(".toggle-group").hasClass("accordion")) {
          $(this).parent().siblings().find("h4").removeClass("active");
          $(this).parent().siblings().find(".toggle-content").stop(true, true).slideUp(toggleSpeed);
        }
      }
      return false;
    });
    if ($("iframe,video").length) {
      $("html").fitVids();
    }
  },

  hideProjectDetails: function hideProjectDetails(forever, safeClose) {
    $("body").scrollTop(0);

    if (forever) {
      portfolioActive = $(".p-overlay.active");
      $("html").removeClass("p-overlay-on");
      if (!safeClose) {
        $.address.path(portfolioKeyword);
      }
    }

    portfolioActive.removeClass("active");

    if (classicLayout) {
      portfolioActive.hide().empty();
    } else {
      portfolioActive.removeClass("animate-in animate-out").addClass("animate-out").removeClass("active").fadeOut().empty();

      $("html").removeClass("p-overlay-on");
    }
  },

  giveDetailUrl: function giveDetailUrl() {
    var address = $.address.value();
    var detailUrl;
    if (address.indexOf("/" + portfolioKeyword + "/") != -1 && address.length > portfolioKeyword.length + 2) {
      var total = address.length;
      detailUrl = address.slice(portfolioKeyword.length + 2, total);
    } else {
      detailUrl = -1;
    }
    return detailUrl;
  },

  setActivePage: function setActivePage() {
    var path = $.address.path();
    path = path.slice(1, path.length);
    path = page.giveDetailUrl() != -1 ? portfolioKeyword : path;
    if (path == "") {
      var firstPage = $(".nav-menu li").first().find("a").attr("href");
      path = firstPage.slice(2, firstPage.length);
      if (classicLayout) {
        $("#" + path).addClass("page-current").siblings().removeClass("page-current");
      } else {
        $("#" + path).addClass("page-current");
      }
      page.setCurrentMenuItem();

      return false;
    } else {
      if (page.giveDetailUrl() == -1) {
        if (classicLayout) {
          $("#" + path).addClass("page-current").siblings().removeClass("page-current");
          page.setCurrentMenuItem();
        } else {
          if (!$(".page-current").length) {
            $("#" + path).addClass("page-current");
            current = $("#" + path).index();
            page.setCurrentMenuItem();
          } else {
            page.nextPage($("#" + path).index());
          }
        }
      }
    }
  },

  nextPage: function nextPage(nextPageIndex) {
    if (nextPageIndex === current) {
      return;
    }
    var animation = nextPageIndex > current ? nextAnimation : prevAnimation;

    if (randomize) {
      if (animcursor > 67) {
        animcursor = 1;
      }
      animation = animcursor;
      ++animcursor;
    }
    if (window.isAnimating) {
      return false;
    }
    window.isAnimating = true;
    var $currPage = $pages.eq(current);
    current = nextPageIndex;
    var $nextPage = $pages.eq(current).addClass("page-current");
    switch (animation) {
      case 1:
        outClass = "pt-page-moveToLeft";
        inClass = "pt-page-moveFromRight";
        break;
      case 2:
        outClass = "pt-page-moveToRight";
        inClass = "pt-page-moveFromLeft";
        break;
      case 3:
        outClass = "pt-page-moveToTop";
        inClass = "pt-page-moveFromBottom";
        break;
      case 4:
        outClass = "pt-page-moveToBottom";
        inClass = "pt-page-moveFromTop";
        break;
      case 5:
        outClass = "pt-page-fade";
        inClass = "pt-page-moveFromRight pt-page-ontop";
        break;
      case 6:
        outClass = "pt-page-fade";
        inClass = "pt-page-moveFromLeft pt-page-ontop";
        break;
      case 7:
        outClass = "pt-page-fade";
        inClass = "pt-page-moveFromBottom pt-page-ontop";
        break;
      case 8:
        outClass = "pt-page-fade";
        inClass = "pt-page-moveFromTop pt-page-ontop";
        break;
      case 9:
        outClass = "pt-page-moveToLeftFade";
        inClass = "pt-page-moveFromRightFade";
        break;
      case 10:
        outClass = "pt-page-moveToRightFade";
        inClass = "pt-page-moveFromLeftFade";
        break;
      case 11:
        outClass = "pt-page-moveToTopFade";
        inClass = "pt-page-moveFromBottomFade";
        break;
      case 12:
        outClass = "pt-page-moveToBottomFade";
        inClass = "pt-page-moveFromTopFade";
        break;
      case 13:
        outClass = "pt-page-moveToLeftEasing pt-page-ontop";
        inClass = "pt-page-moveFromRight";
        break;
      case 14:
        outClass = "pt-page-moveToRightEasing pt-page-ontop";
        inClass = "pt-page-moveFromLeft";
        break;
      case 15:
        outClass = "pt-page-moveToTopEasing pt-page-ontop";
        inClass = "pt-page-moveFromBottom";
        break;
      case 16:
        outClass = "pt-page-moveToBottomEasing pt-page-ontop";
        inClass = "pt-page-moveFromTop";
        break;
      case 17:
        outClass = "pt-page-scaleDown";
        inClass = "pt-page-moveFromRight pt-page-ontop";
        break;
      case 18:
        outClass = "pt-page-scaleDown";
        inClass = "pt-page-moveFromLeft pt-page-ontop";
        break;
      case 19:
        outClass = "pt-page-scaleDown";
        inClass = "pt-page-moveFromBottom pt-page-ontop";
        break;
      case 20:
        outClass = "pt-page-scaleDown";
        inClass = "pt-page-moveFromTop pt-page-ontop";
        break;
      case 21:
        outClass = "pt-page-scaleDown";
        inClass = "pt-page-scaleUpDown pt-page-delay300";
        break;
      case 22:
        outClass = "pt-page-scaleDownUp";
        inClass = "pt-page-scaleUp pt-page-delay300";
        break;
      case 23:
        outClass = "pt-page-moveToLeft pt-page-ontop";
        inClass = "pt-page-scaleUp";
        break;
      case 24:
        outClass = "pt-page-moveToRight pt-page-ontop";
        inClass = "pt-page-scaleUp";
        break;
      case 25:
        outClass = "pt-page-moveToTop pt-page-ontop";
        inClass = "pt-page-scaleUp";
        break;
      case 26:
        outClass = "pt-page-moveToBottom pt-page-ontop";
        inClass = "pt-page-scaleUp";
        break;
      case 27:
        outClass = "pt-page-scaleDownCenter";
        inClass = "pt-page-scaleUpCenter pt-page-delay400";
        break;
      case 28:
        outClass = "pt-page-rotateRightSideFirst";
        inClass = "pt-page-moveFromRight pt-page-delay200 pt-page-ontop";
        break;
      case 29:
        outClass = "pt-page-rotateLeftSideFirst";
        inClass = "pt-page-moveFromLeft pt-page-delay200 pt-page-ontop";
        break;
      case 30:
        outClass = "pt-page-rotateTopSideFirst";
        inClass = "pt-page-moveFromTop pt-page-delay200 pt-page-ontop";
        break;
      case 31:
        outClass = "pt-page-rotateBottomSideFirst";
        inClass = "pt-page-moveFromBottom pt-page-delay200 pt-page-ontop";
        break;
      case 32:
        outClass = "pt-page-flipOutRight";
        inClass = "pt-page-flipInLeft pt-page-delay500";
        break;
      case 33:
        outClass = "pt-page-flipOutLeft";
        inClass = "pt-page-flipInRight pt-page-delay500";
        break;
      case 34:
        outClass = "pt-page-flipOutTop";
        inClass = "pt-page-flipInBottom pt-page-delay500";
        break;
      case 35:
        outClass = "pt-page-flipOutBottom";
        inClass = "pt-page-flipInTop pt-page-delay500";
        break;
      case 36:
        outClass = "pt-page-rotateFall pt-page-ontop";
        inClass = "pt-page-scaleUp";
        break;
      case 37:
        outClass = "pt-page-rotateOutNewspaper";
        inClass = "pt-page-rotateInNewspaper pt-page-delay500";
        break;
      case 38:
        outClass = "pt-page-rotatePushLeft";
        inClass = "pt-page-moveFromRight";
        break;
      case 39:
        outClass = "pt-page-rotatePushRight";
        inClass = "pt-page-moveFromLeft";
        break;
      case 40:
        outClass = "pt-page-rotatePushTop";
        inClass = "pt-page-moveFromBottom";
        break;
      case 41:
        outClass = "pt-page-rotatePushBottom";
        inClass = "pt-page-moveFromTop";
        break;
      case 42:
        outClass = "pt-page-rotatePushLeft";
        inClass = "pt-page-rotatePullRight pt-page-delay180";
        break;
      case 43:
        outClass = "pt-page-rotatePushRight";
        inClass = "pt-page-rotatePullLeft pt-page-delay180";
        break;
      case 44:
        outClass = "pt-page-rotatePushTop";
        inClass = "pt-page-rotatePullBottom pt-page-delay180";
        break;
      case 45:
        outClass = "pt-page-rotatePushBottom";
        inClass = "pt-page-rotatePullTop pt-page-delay180";
        break;
      case 46:
        outClass = "pt-page-rotateFoldLeft";
        inClass = "pt-page-moveFromRightFade";
        break;
      case 47:
        outClass = "pt-page-rotateFoldRight";
        inClass = "pt-page-moveFromLeftFade";
        break;
      case 48:
        outClass = "pt-page-rotateFoldTop";
        inClass = "pt-page-moveFromBottomFade";
        break;
      case 49:
        outClass = "pt-page-rotateFoldBottom";
        inClass = "pt-page-moveFromTopFade";
        break;
      case 50:
        outClass = "pt-page-moveToRightFade";
        inClass = "pt-page-rotateUnfoldLeft";
        break;
      case 51:
        outClass = "pt-page-moveToLeftFade";
        inClass = "pt-page-rotateUnfoldRight";
        break;
      case 52:
        outClass = "pt-page-moveToBottomFade";
        inClass = "pt-page-rotateUnfoldTop";
        break;
      case 53:
        outClass = "pt-page-moveToTopFade";
        inClass = "pt-page-rotateUnfoldBottom";
        break;
      case 54:
        outClass = "pt-page-rotateRoomLeftOut pt-page-ontop";
        inClass = "pt-page-rotateRoomLeftIn";
        break;
      case 55:
        outClass = "pt-page-rotateRoomRightOut pt-page-ontop";
        inClass = "pt-page-rotateRoomRightIn";
        break;
      case 56:
        outClass = "pt-page-rotateRoomTopOut pt-page-ontop";
        inClass = "pt-page-rotateRoomTopIn";
        break;
      case 57:
        outClass = "pt-page-rotateRoomBottomOut pt-page-ontop";
        inClass = "pt-page-rotateRoomBottomIn";
        break;
      case 58:
        outClass = "pt-page-rotateCubeLeftOut pt-page-ontop";
        inClass = "pt-page-rotateCubeLeftIn";
        break;
      case 59:
        outClass = "pt-page-rotateCubeRightOut pt-page-ontop";
        inClass = "pt-page-rotateCubeRightIn";
        break;
      case 60:
        outClass = "pt-page-rotateCubeTopOut pt-page-ontop";
        inClass = "pt-page-rotateCubeTopIn";
        break;
      case 61:
        outClass = "pt-page-rotateCubeBottomOut pt-page-ontop";
        inClass = "pt-page-rotateCubeBottomIn";
        break;
      case 62:
        outClass = "pt-page-rotateCarouselLeftOut pt-page-ontop";
        inClass = "pt-page-rotateCarouselLeftIn";
        break;
      case 63:
        outClass = "pt-page-rotateCarouselRightOut pt-page-ontop";
        inClass = "pt-page-rotateCarouselRightIn";
        break;
      case 64:
        outClass = "pt-page-rotateCarouselTopOut pt-page-ontop";
        inClass = "pt-page-rotateCarouselTopIn";
        break;
      case 65:
        outClass = "pt-page-rotateCarouselBottomOut pt-page-ontop";
        inClass = "pt-page-rotateCarouselBottomIn";
        break;
      case 66:
        outClass = "pt-page-rotateSidesOut";
        inClass = "pt-page-rotateSidesIn pt-page-delay200";
        break;
      case 67:
        outClass = "pt-page-rotateSlideOut";
        inClass = "pt-page-rotateSlideIn";
        break;
    }
    $currPage.addClass(outClass).on(animEndEventName, function () {
      $currPage.off(animEndEventName);
      endCurrPage = true;
      if (endNextPage) {
        page.onEndAnimation($currPage, $nextPage);
      }
    });
    $nextPage.addClass(inClass).on(animEndEventName, function () {
      $nextPage.off(animEndEventName);
      endNextPage = true;
      if (endCurrPage) {
        page.onEndAnimation($currPage, $nextPage);
      }
    });
    if (!support) {
      page.onEndAnimation($currPage, $nextPage);
    }
  },

  onEndAnimation: function onEndAnimation($outpage, $inpage) {
    endCurrPage = false;
    endNextPage = false;
    page.resetPage($outpage, $inpage);
    window.isAnimating = false;
    page.setCurrentMenuItem();
  },

  resetPage: function resetPage($outpage, $inpage) {
    $outpage.removeClass(outClass);
    $inpage.removeClass(inClass);
    $pages.eq(current).siblings().removeClass("page-current");
  },

  setCurrentMenuItem: function setCurrentMenuItem() {
    var activePageId = $(".pt-page.page-current").attr("id");

    $(".nav-menu a[href$=" + activePageId + "]").parent().addClass("current_page_item").siblings().removeClass("current_page_item");

    page.raisePageChanged();
  },

  raisePageChanged: function raisePageChanged() {
    var path = $.address.path();
    path = path.slice(1, path.length);
    var evt = new CustomEvent("pageChanged", { detail: path });

    window.dispatchEvent(evt);
  }
};

var typist = {
  initialize: function initialize() {
    $(window).load(function () {
      var typist = document.querySelector("#typist-element");

      new Typist(typist, {
        letterInterval: 60,
        textInterval: 3000
      });
    });
  }
};

var header = {
  initialize: function initialize() {
    $(".search-toggle").on("click", function () {
      $("html").toggleClass("is-search-toggled-on");
      $(".search-box input").trigger("focus");
    });
    $(".menu-toggle").on("click", function () {
      $("html").toggleClass("is-menu-toggled-on");
    });

    var toggleSpeed = 300;
    $(".toggle h4.active + .toggle-content").show();
    $(".toggle h4").on("click", function () {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $(this).next(".toggle-content").stop(true, true).slideUp(toggleSpeed);
      } else {
        $(this).addClass("active");
        $(this).next(".toggle-content").stop(true, true).slideDown(toggleSpeed);

        if ($(this).parents(".toggle-group").hasClass("accordion")) {
          $(this).parent().siblings().find("h4").removeClass("active");
          $(this).parent().siblings().find(".toggle-content").stop(true, true).slideUp(toggleSpeed);
        }
      }
      return false;
    });
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    if (isAndroid) {
      $("html").addClass("android");
    }
  }
};

var responsive = {
  initialize: function initialize() {
    FastClick.attach(document.body);
  }
};

var form = {
  applyValidators: function applyValidators() {
    $("#contact-form").addClass("validate-form");
    $("#contact-form").find("input,textarea").each(function (index, element) {
      if ($(this).attr("aria-required") === "true") {
        $(this).addClass("required");
      }
      if ($(this).attr("name") === "email") {
        $(this).addClass("email");
      }
    });

    if ($(".validate-form").length) {
      $(".validate-form").each(function () {
        $(this).validate({
          ignore: ".ignore",
          rules: {
            hiddenRecaptcha: {
              required: function required() {
                if (grecaptcha.getResponse() == "") {
                  return true;
                } else {
                  return false;
                }
              }
            }
          }
        });
      });
    }
  }
};

var email = {
  initialize: function initialize() {
    var contactForm = $("#contact-form");
    var $alert = $(".site-alert");
    var $submit = contactForm.find(".submit");
    contactForm.submit(function (event) {
      event.preventDefault();
      sendEmail(contactForm);
    });

    function sendEmail(contactForm) {
      if (contactForm.valid()) {
        NProgress.start();
        $submit.addClass("active loading");
        $.ajax({
          url: contactForm.attr("action"),
          type: contactForm.attr("method"),
          dataType: "JSON",
          crossDomain: true,
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify(contactForm.serializeObject()),
          success: function success(data) {
            contactForm.clearForm();
          },
          error: function error(textStatus, errorThrown) {
            $alert.addClass("error");
          },
          complete: function complete() {
            NProgress.done();
            $alert.show();
            setTimeout(function () {
              $alert.hide();
            }, 6000);
          }
        });
      }
    }
    $.fn.serializeObject = function () {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function () {
        if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || "");
        } else {
          o[this.name] = this.value || "";
        }
      });
      return o;
    };
    $.fn.clearForm = function () {
      grecaptcha.reset();
      $(".contact-form #name").focus();

      return this.each(function () {
        var type = this.type,
            tag = this.tagName.toLowerCase();
        if (tag == "form") return $(":input", this).clearForm();
        if (type == "text" || type == "password" || tag == "textarea" || type == "email") this.value = "";else if (type == "checkbox" || type == "radio") this.checked = false;else if (tag == "select") this.selectedIndex = -1;
      });
    };
  }
};

var maps = {
  intialize: function intialize() {
    var mapCanvas = $("#map-canvas");

    if (mapCanvas.length) {
      //google.maps.event.addDomListener(window, "load", initializeMap);
    }
  }
};

var snackBar = {
  initialize: function initialize() {
    $(window).load(function () {
      window.setTimeout(show, 2000);
    });
  }
};
function show() {
  var snackBarWasShown = window.localStorage.getItem("_sbSW");

  if (snackBarWasShown) return;

  var snackbar = $(".snackbar");

  if (!snackbar) return;

  snackbar.fadeIn("slow");

  window.setTimeout(function () {
    snackbar.fadeOut();
  }, 6000);

  hideWhenClicked(snackbar);
}
function hideWhenClicked(snackbar) {
  $(".snackbar").click(function (e) {
    snackbar.hide();

    window.localStorage.setItem("_sbSW", "true");
  });
}

var initializer = {
  initialize: function initialize() {
    utilities.loadImagesAsync();
    loader.initialize();
    maps.intialize();
    utilities.initializeFillBars();
    header.initialize();
    responsive.initialize();
    form.applyValidators();
    email.initialize();
    page.initialize();
    snackBar.initialize();
    typist.initialize();
    utilities.initializeHoursWorked();
    utilities.initializeAge();
    utilities.initializeStamp();
    utilities.loadDownloadeableResume();
    masonry.initialize();
  }
};

(function ($) {

  initializer.initialize();
})(jQuery);
