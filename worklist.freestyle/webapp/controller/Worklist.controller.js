sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator"
], function (BaseController, JSONModel, Filter, FilterOperator, MessageToast, BusyIndicator) {
    "use strict";

    return BaseController.extend("worklist.freestyle.controller.Worklist", {

        onInit: function () {
            var iOriginalBusyDelay,
                oViewModel = new JSONModel({
                    busy: true,
                    delay: 0
                });

            this.setModel(oViewModel, "objectView");

            iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
            this.getOwnerComponent().getModel().metadataLoaded().then(function () {
                oViewModel.setProperty("/delay", iOriginalBusyDelay);
            });
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue").trim();
            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                var oFilter = new Filter("SalesOrder", FilterOperator.Contains, sQuery);
                aFilters.push(oFilter);
            }

            var oTable = this.byId("table_ov");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        onPress: function (oEvent) {
            this._showObject(oEvent.getSource());
        },

        _showObject: function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getProperty("SalesOrder")
            });
        },

        onPrintPress: function(oEvent) {
            var oTable = this.byId("table_ov");
            var aSelectedContexts = oTable.getSelectedContexts();

            if (aSelectedContexts.length === 0) {
                MessageToast.show("Nenhum item selecionado.");
                return;
            }

            var selectedVbelns = [];
            aSelectedContexts.forEach(function(element) {
                var data = element.getModel().getObject(element.getPath());
                if (data && data.SalesOrder) {  // Certifique-se de que 'SalesOrder' é o campo correto
                    selectedVbelns.push(data.SalesOrder);
                }
            });

            if (selectedVbelns.length > 0) {
                BusyIndicator.show(1);

                var deepLink = "https://vm43.4hub.cloud:44343/sap/bc/ui2/flp?sap-client=100&sap-language=PT#SalesOrderMsf-display";
                deepLink += "?SalesOrder=" + encodeURIComponent(selectedVbelns.join(","));

                window.open(deepLink, "_blank");
                BusyIndicator.hide();
            } else {
                MessageToast.show("Nenhum Vbeln encontrado nos itens selecionados.");
            }
        }
    });
});
