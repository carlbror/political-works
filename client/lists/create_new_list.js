Template.createNewList.events({
    'change .important-work': function(event){
        $('#essential-' + event.target.id.split('-')[1]).prop('checked', false);
    },
    'change .essential-work': function(event){
        $('#important-' + event.target.id.split('-')[1]).prop('checked', false);
    },

    'click .create-new-list': function(event){
        var importantWorks = [],
            essentialWorks = [],
            nameForList = $('.list-name').val();

        _.each(this.works, function(work){
            if($('#important-' + work._id).prop('checked')){
                importantWorks.push(work._id);
            }

            if($('#essential-' + work._id).prop('checked')){
                essentialWorks.push(work._id);
            }
        });

        if(!importantWorks && !essentialWorks)
            throwError('No works selected');
        if(_.intersection(importantWorks, essentialWorks).length !== 0)
            throwError('Error, one selected work is marked as both essential and important');
        if(!nameForList)
            throwError('Error, no name for list');

        Meteor.call('createNewList', importantWorks, essentialWorks, nameForList, function(err, listId){
            if(err) throwError(err.message);
            _.each(importantWorks, function(work){
                $('#important-' + work).prop('checked', false);
            });
            _.each(essentialWorks, function(work){
                $('#essential-' + work).prop('checked', false);
            });
            $('.list-name').val('');

            Session.set('newList', '<span style="margin-left: 10px;">New list: <a href="/lists/' +
                nameForList + '/' + listId + '">' + nameForList + '</a></span>');
        });
    }
});

Template.createNewList.helpers({
    newList: function(){
        return Session.get('newList');
    }
});