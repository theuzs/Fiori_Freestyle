sap.ui.define([
    "moovi/m10a2/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
    "use strict";
    return Controller.extend("moovi.m10a2.controller.CompanyDetail", {
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("RouteCompanyDetail").attachMatched(this.onRouteMatched, this);

        },

        onRouteMatched: function (oEvent) {
            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();

            var oEditModel = this.getView().getModel("editCompanyModel");
            oEditModel.setProperty("/isNew", false);

            
            if(oArgs.carrId !== "New"){
                oView.bindElement({
                    path: "/ScarrSet('" + oArgs.carrId + "')",
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function (oEvent) {
                            oView.setBusy(true);
                        },
                        dataReceived: function (oEvent) {
                            oView.setBusy(false);
                        }
                    }
                });  
            }
            else{
                this._initNewCompany();
            }
          

        },   
        _initNewCompany: function () {
          

            var oModel = this.getView().getModel();

            var oEditModel = this.getView().getModel("editCompanyModel");
            oEditModel.setProperty("/isNew", true);

            oModel.setDeferredGroups(["creategroupId"]);
            oModel.setChangeGroups({
                "ScarrSet": {
                    groupId: "creategroupId",
                    changeSetId: "ID"
                }
            });

            var oContext = oModel.createEntry("/ScarrSet", {
                groupId: "creategroupId",
                properties: {}
            });

            var oView = this.getView();
            oView.bindElement(oContext.getPath());

        },
        
        _onBindingChange: function (oEvent) {
            // No data for the binding
            if (!this.getView().getBindingContext()) {
                this.getRouter().getTargets().display("TargetNotFound");
            }

        },
        onBtnSavePress: function (oEvent) {
            var oModel = this.getView().getModel();

            oModel.submitChanges({
                success: this.handleSuccessSave.bind(this),
                error: this.handleSaveError.bind(this),
            });


        },

        handleSuccessSave: function (oRes, oData) {

            var oModel = this.getView().getModel();
            if (oRes.__batchResponses) {

                if (oRes.__batchResponses[0].response) {
                     var status = parseInt(oRes.__batchResponses[0].response.statusCode);

                    if (status >= 400) {

                        var oResponseBody = JSON.parse(oRes.__batchResponses[0].response.body);
                        MessageBox.alert("Erro ao Salvar. ERRO:" + oResponseBody.error.message.value);
                        oModel.resetChanges();
                        oModel.refresh();

                    } else {
                        MessageToast.show("Salvo com sucesso!");
                        this.onNavBack();

                    }
                }else if(oRes.__batchResponses[0].__changeResponses){
                    var aChangeRes =  oRes.__batchResponses[0].__changeResponses;

                     var status = parseInt(aChangeRes[0].statusCode);

                    if (status >= 400) {
                      
                        MessageBox.alert("Erro ao Salvar");
                        oModel.resetChanges();
                        oModel.refresh();

                    } else {
                        MessageToast.show("Salvo com sucesso!");
                        this.onNavBack();

                    }

                }
               

            }else{
                 MessageToast.show("Salvo com sucesso!");
                 this.onNavBack();
            }

        },

        handleSaveError: function (oError) {
            if (oError) {
                if (oError.responseText) {
                    var oErrorMessage = JSON.parse(oError.responseText);
                    MessageBox.alert(oErrorMessage.error.message.value);
                }
            }
        },

        onBtnDeletePress: function (oEvent) {
            var oModel = this.getView().getModel(),
                oContext =  this.getView().getBindingContext(),
                that = this;

           MessageBox.warning(
				"O Registro Será excluído! Deseja continuar?",
				{
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],					
					onClose: function(sAction) {
						if (sAction == MessageBox.Action.OK) {
                            oModel.remove(oContext.getPath(), {
                                success: that.handleSuccessDelete.bind(that), 
                                error: that.handleErrorDelete.bind(that),
                            });
                        }
					}
				}
			);


        },

        handleSuccessDelete: function(oRes){
            MessageToast.show("Registro Excluído com sucesso!");
            this.onNavBack();
        },

        handleErrorDelete: function(oError){
            if (oError) {
               if (oError.responseText) {
                   var oErrorMessage = JSON.parse(oError.responseText);
                   MessageBox.alert(oErrorMessage.error.message.value);
               }
           }
        }


    });
});