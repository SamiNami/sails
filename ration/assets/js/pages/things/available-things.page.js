parasails.registerPage('available-things', {
    //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
    //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
    //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
    data: {
        things: [],
        confirmDeleteModalOpen: false,
        selectedThing: null,
        // syncing / loading state
        syncing: false,
        // server Error state
        cloudError: '',

        // uload modal
        uploadModalOpen: false,
        uploadFromData: {
            label: '',
            photo: null
        },
        formErrors: {}
    },

    //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
    //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
    //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
    beforeMount: function() {
        // Attach any initial data from the server.
        _.extend(this, SAILS_LOCALS);
    },
    mounted: async function() {
        //…
    },

    //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
    //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
    methods: {
        clickDeleteButton: function(thingId) {
            this.selectedThing = _.find(this.things, { id: thingId });
            this.confirmDeleteModalOpen = true;
        },

        closeDeleteModal: function() {
            this.selectedThing = null;
            this.confirmDeleteModalOpen = false;
        },

        handleParsingDeleteThingForm: function() {
            return {
                id: this.selectedThing.id
            };
        },

        submittedDeleteThingForm: function() {
            _.remove(this.things, { id: this.selectedThing.id });
            this.$forceUpdate();

            this.confirmDeleteModalOpen = false;
            this.selectedThing = null;
        },

        clickAddThingButton: function() {
            this.uploadModalOpen = true;
        },

        handleParsingUploadForm: function() {
            this.formErrors = {};

            const argins = this.uploadFromData;

            // Todo validation goes here

            if (Object.keys(this.formErrors).length > 0) {
                return;
            }
            return argins;
        },

        submittedUploadThingForm: function(result) {
            console.log(result);
            console.log(this.uploadFromData);
            this.things.push({
                label: this.uploadFromData.label,
                id: result.id,
                owner: {
                    id: this.me.id,
                    fullName: this.me.fullName
                }
            });

            this._clearUploadThingModal();
        },

        _clearUploadThingModal: function() {
            this.uploadModalOpen = false;

            this.uploadFromData = {
                label: '',
                photo: null
            };

            this.formErrors = {};
            this.cloudError = '';
        },

        changeFileInput: function(files) {
            const selectedFile = files[0];
            if (!selectedFile) {
                this.uploadFromData.photo = null;
                return;
            }

            this.uploadFromData.photo = selectedFile;
        },

        changeThingLabel: function(event) {

            if (!event) {
                return
            }

            const currentLabel = event.target.value;

            if (!currentLabel) {
                return 
            }

            this.uploadFromData.label = event.target.value;
        }
    }
});
