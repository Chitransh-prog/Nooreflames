
    (function() {
      var preconnectOrigins = ["https://cdn.shopify.com"];
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.Db3KX98s.js","/cdn/shopifycloud/checkout-web/assets/c1/app.IjrcN30x.js","/cdn/shopifycloud/checkout-web/assets/c1/esnext-vendor.5raVCjZP.js","/cdn/shopifycloud/checkout-web/assets/c1/context-browser.BlocW9vR.js","/cdn/shopifycloud/checkout-web/assets/c1/stopwatch.2N3jg205.js","/cdn/shopifycloud/checkout-web/assets/c1/receipt-mapper-load-recovery.CLstWuw1.js","/cdn/shopifycloud/checkout-web/assets/c1/receipt-eager-mappers.BIbotqqq.js","/cdn/shopifycloud/checkout-web/assets/c1/helpers-setAddressErrors.CrIfpevj.js","/cdn/shopifycloud/checkout-web/assets/c1/shop-pay-normalizeBuyerDetails.DQ6JjGxK.js","/cdn/shopifycloud/checkout-web/assets/c1/addresses-is-address-empty.CqM6LNaG.js","/cdn/shopifycloud/checkout-web/assets/c1/sections-shared.cBQvqhFY.js","/cdn/shopifycloud/checkout-web/assets/c1/consent-manager-shared.DJMY7BCf.js","/cdn/shopifycloud/checkout-web/assets/c1/error-logger-report-graphql-error.Dzl0TZrd.js","/cdn/shopifycloud/checkout-web/assets/c1/helpers-derivations.DAqTnUVx.js","/cdn/shopifycloud/checkout-web/assets/c1/mappers-checkout-policy.BRu7eahe.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-browser.DOwA3d_m.js","/cdn/shopifycloud/checkout-web/assets/c1/hydrate.Dz8L0wDG.js","/cdn/shopifycloud/checkout-web/assets/c1/shop-pay-installments-monorail.DuEFGRv4.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en.C8oNzlii.js","/cdn/shopifycloud/checkout-web/assets/c1/OnePage.DUMge-vg.js","/cdn/shopifycloud/checkout-web/assets/c1/components-DeliveryTransition.CNDZuCyW.js","/cdn/shopifycloud/checkout-web/assets/c1/useShopPayButtonClassName.BCbb2ubr.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useUnauthenticatedErrorModal.gx24T__L.js","/cdn/shopifycloud/checkout-web/assets/c1/cross-border-hooks.DjjHf8bI.js","/cdn/shopifycloud/checkout-web/assets/c1/crypto-constants.Cz3uSx-X.js","/cdn/shopifycloud/checkout-web/assets/c1/ChangeCompanyLocationLink.Barkmh2t.js","/cdn/shopifycloud/checkout-web/assets/c1/BillingAddressForm.ZFfCZ2z_.js","/cdn/shopifycloud/checkout-web/assets/c1/PhoneField.BRYfVXZE.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useSuppressShopPayModalOnLoad.YlRtAKRu.js","/cdn/shopifycloud/checkout-web/assets/c1/components-RedirectionNotice.module.CmM05ZdJ.js","/cdn/shopifycloud/checkout-web/assets/c1/Popover.B9irdcbH.js","/cdn/shopifycloud/checkout-web/assets/c1/Choice.BawvSPKR.js","/cdn/shopifycloud/checkout-web/assets/c1/shop-pay-installments-types.Coj7EIkQ.js","/cdn/shopifycloud/checkout-web/assets/c1/Checkbox.CQEkMJqW.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useForceShopPayUrl.DShjm8OR.js","/cdn/shopifycloud/checkout-web/assets/c1/shipping-methods-grouping.B47Qf05r.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-previous.B3FkpFwy.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShowShopPayOptin.PuL5oPkH.js","/cdn/shopifycloud/checkout-web/assets/c1/ShopPayLogo.C5gJVMq9.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useWalletsTimeout.DKTVoGFT.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-usePostPurchase.bTV0kMIB.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-PaymentSessionMutation.D7pGdUwQ.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useWalletsMonorailTrack.SALODOjk.js","/cdn/shopifycloud/checkout-web/assets/c1/MarketsProDisclaimer.DcxMgsL3.js","/cdn/shopifycloud/checkout-web/assets/c1/IncentiveBadge.BAjyc5_K.js","/cdn/shopifycloud/checkout-web/assets/c1/AutocompleteField-hooks.CSgdGDvt.js","/cdn/shopifycloud/checkout-web/assets/c1/PendingShipping.BMD4GRZf.js","/cdn/shopifycloud/checkout-web/assets/c1/useAddressMutationsWithNegotiation.CWOJohKs.js","/cdn/shopifycloud/checkout-web/assets/c1/PaymentIcon.CmRz2Oee.js","/cdn/shopifycloud/checkout-web/assets/c1/PaymentLine.Do698VKW.js","/cdn/shopifycloud/checkout-web/assets/c1/Theme-ThemeOverride.BI9pY1Dg.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useUpdateCheckoutAddress.CLaNXCWH.js","/cdn/shopifycloud/checkout-web/assets/c1/payment-usePaymentExemptionReason.PWXYjtPu.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShopPayProgressIntercepts.CC_AUt5Q.js","/cdn/shopifycloud/checkout-web/assets/c1/Section.DwEiCfUE.js","/cdn/shopifycloud/checkout-web/assets/c1/Section-SectionStyleOverride.CgWyGBnJ.js","/cdn/shopifycloud/checkout-web/assets/c1/PaymentErrorBanner.WEo_CXDg.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useGeneralPaymentErrorMessage.DSRY3xOf.js","/cdn/shopifycloud/checkout-web/assets/c1/StickyPayButton-StickyPayButton.module.BIzwkc0z.js","/cdn/shopifycloud/checkout-web/assets/c1/PayButton-helpers.Dx5sU-4x.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-payment-button.CQgK_TdV.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-usePreselectSpi.Cw-ow9op.js","/cdn/shopifycloud/checkout-web/assets/c1/Switch.H3BhxEN7.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useAvailableShopPromotionDiscounts.OCdur2Nk.js","/cdn/shopifycloud/checkout-web/assets/c1/checkout-as-guest-amazon-pay.CsUiAyOO.js","/cdn/shopifycloud/checkout-web/assets/c1/Middot.M_vO82RY.js","/cdn/shopifycloud/checkout-web/assets/c1/EstimatedDeliveryContent.BYv1yW09.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingMethodRateLabel.C85Mafo0.js","/cdn/shopifycloud/checkout-web/assets/c1/shipping-methods-consolidated-included.DtlASH1l.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingLines.C1c9Q1fJ.js","/cdn/shopifycloud/checkout-web/assets/c1/ShipmentBreakdown.DaMdWwrf.js","/cdn/shopifycloud/checkout-web/assets/c1/MerchandiseModal.Dtyw77Pu.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingMethodSelector.iPfUEmWe.js","/cdn/shopifycloud/checkout-web/assets/c1/TextArea.-txs_yoH.js","/cdn/shopifycloud/checkout-web/assets/c1/SubscriptionPriceBreakdown.7kLdMWxS.js","/cdn/shopifycloud/checkout-web/assets/c1/StockProblems-StockProblemsLineItemList.DFRcSQx2.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.C61fwjfC.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/stopwatch.Dy6nOzcc.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/helpers.Cv83qqYE.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OnePage.CNHfYFLR.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/DeliveryTransition.CxmS455s.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useAddressMutationsWithNegotiation.DPEapfiO.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Section.CU18S7Ap.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentLine.D3bcP-mr.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/StickyPayButton.3WRao8Y9.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentIcon.CLVwzp6i.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayProgressIntercepts.CIy8uDiZ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Choice.CP8QNAbt.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/IncentiveBadge.Dlnp55te.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/BillingAddressForm.BdwN7V1K.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Switch.Dq_6Ius6.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayButtonClassName.CpHF4L7Q.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PhoneField.uZEuHncj.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Middot.D7Ujmshx.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShippingLines.LcqrKXE1.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/MerchandiseModal.D6OuIVjc.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/EstimatedDeliveryContent.B_THySFF.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/RedirectionNotice.B8v_QGNW.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShowShopPayOptin.BYM12A8B.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = [];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = preconnectOrigins.concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  