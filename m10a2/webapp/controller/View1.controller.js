sap.ui.define([
    "moovi/m10a2/controller/BaseController"    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("moovi.m10a2.controller.View1", {
            onInit: function () {

            },

            onListItemPress: function(oEvent){

                var oItem, oCtx;
                oItem = oEvent.getSource();
			    oCtx = oItem.getBindingContext();                 
                    this.getRouter().navTo("RouteCompanyDetail",{
                        carrId :  oCtx.getProperty("Carrid")
                    });

            },
            onBtnCreatePress: function(oEvent){

                this.getRouter().navTo("RouteCompanyDetail",{
                    carrId: "New"
                });
            }	
        });
    });