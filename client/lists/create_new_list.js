Template.createNewList.events({
    'change .necessary-work': function(event){
        $('#essential-' + event.target.id.split('-')[1]).prop('checked', false);
    },
    'change .essential-work': function(event){
        $('#necessary-' + event.target.id.split('-')[1]).prop('checked', false);
    },

    'click .create-new-list': function(event){
        console.log("hello");
        var necessaryWorks = [],
            essentialWorks = [];

        _.each(this.works, function(work){
            if($('#necessary-' + work._id).prop('checked')){
                necessaryWorks.push(work._id);
            }

            if($('#essential-' + work._id).prop('checked')){
                essentialWorks.push(work._id);
            }
        });

        if(_.intersection(necessaryWorks, essentialWorks).length === 0){
            throwError('Error, one selected work is marked as both essential and necessary');
        }

        Meteor.call('createNewList', necessaryWorks, essentialWorks, $('.list-name').val(), function(err){
            if(err) throwError(err.message);

        });
    }
});