sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "worklist/freestyle/model/formatter",
], function (Controller, JSONModel, ODataModel, formatter) {
    "use strict";

    return Controller.extend("worklist.freestyle.controller.Object", {

        formatter: formatter,
        onInit: function () {
            console.log("onInit called");

            var oModel = this.getOwnerComponent().getModel("mainService");
            if (!oModel) {
                oModel = new ODataModel("/sap/opu/odata/sap/Z_ORDERVIEW_CDS/");
                this.getOwnerComponent().setModel(oModel, "mainService");
            }

            var oRouter = this.getOwnerComponent().getRouter();
            console.log("Router instance:", oRouter);

            var oRoute = oRouter.getRoute("object");
            if (oRoute) {
                console.log("Route 'object' found");
                oRoute.attachPatternMatched(this._onObjectMatched, this);
            } else {
                console.error("Route 'object' not found");
            }
        },
        _onObjectMatched: function (oEvent) {
            console.log("_onObjectMatched called");

            var oArguments = oEvent.getParameter("arguments");
            if (oArguments && oArguments.objectId) {
                var sObjectId = oArguments.objectId;
                console.log("Object ID:", sObjectId);

                var oModel = this.getOwnerComponent().getModel("mainService");
                if (oModel) {
                    console.log("Model instance:", oModel);

                    var sPath = "/Z_OrderView('" + sObjectId + "')";
                    console.log("Path:", sPath);

                    // Faz a leitura do modelo OData com expand para to_DeliveryItems
                    oModel.read(sPath, {
                        urlParameters: {"$expand": "to_DeliveryItems,to_RemessaItems,to_FaturaItems,to_MovMercadoriaItems,to_DevMercadoriaItems" }
                        ,
                        success: function (oData) {
                            console.log("Dados encontrados:", oData);

                            var oViewModel = new JSONModel(oData);
                            this.getView().setModel(oViewModel, "objectView");
                        }.bind(this),
                        error: function (oError) {
                            console.error("Erro ao carregar dados: ", oError);
                        }
                    });
                } else {
                    console.error("Model 'mainService' not found");
                }
            } else {
                console.error("Invalid arguments or 'objectId' not found in arguments");
            }
        }
    });
});
