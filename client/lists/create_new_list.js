Template.createNewList.events({
    'change .necessary-work': function(event){
        $('#essential-' + event.target.id.split('-')[1]).prop('checked', false);
    },
    'change .essential-work': function(event){
        $('#necessary-' + event.target.id.split('-')[1]).prop('checked', false);
    },

    'click .create-new-list': function(event){
        var necessaryWorks = [],
            essentialWorks = [],
            nameForList = $('.list-name').val();

        _.each(this.works, function(work){
            if($('#necessary-' + work._id).prop('checked')){
                necessaryWorks.push(work._id);
            }

            if($('#essential-' + work._id).prop('checked')){
                essentialWorks.push(work._id);
            }
        });

        if(!necessaryWorks && !essentialWorks)
            throwError('No works selected');
        if(_.intersection(necessaryWorks, essentialWorks).length !== 0)
            throwError('Error, one selected work is marked as both essential and necessary');
        if(!nameForList)
            throwError('Error, no name for list');

        Meteor.call('createNewList', necessaryWorks, essentialWorks, nameForList, function(err, listId){
            if(err) throwError(err.message);
            _.each(necessaryWorks, function(work){
                $('#necessary-' + work._id).prop('checked', false);
            });
            _.each(essentialWorks, function(work){
                $('#essential-' + work._id).prop('checked', false);
            });

            var a = document.createElement('a');
            var linkText = document.createTextNode("my title text");
            a.appendChild(linkText);
            a.title = "my title text";
            a.href = "/lists/" + nameForList + "/" + listId;
            document.body.appendChild(a);
        });
    }
});